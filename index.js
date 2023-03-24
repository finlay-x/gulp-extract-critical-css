const through = require("through2");
const Vinyl = require("vinyl");
const fs = require("fs");

const PLUGIN_NAME = "gulp-extract-critical-css";

function extractCriticalCss(file, contents) {
  const startMarker = "/*! CRITICAL:START */";
  const endMarker = "/*! CRITICAL:END */";

  let startIndex = contents.indexOf(startMarker);
  let criticalCss = "";

  while (startIndex !== -1) {
    const endIndex = contents.indexOf(endMarker, startIndex);
    if (endIndex === -1) {
      this.emit(
        "error",
        new Error(
          `gulp-extract-critical-css: End marker not found in file ${file.relative} at index ${startIndex}`
        )
      );
      return callback();
    }

    const section = contents
      .slice(startIndex + startMarker.length, endIndex)
      .trim();

    criticalCss += section + "\n";

    const cssBefore = contents.slice(0, startIndex);
    const cssAfter = contents.slice(endIndex + endMarker.length);

    contents = cssBefore + cssAfter;
    startIndex = contents.indexOf(startMarker);
  }

  return { contents, criticalCss };
}

module.exports = function (options) {
  const inlinePath = options?.inlinePath;
  const inlineCritical = options?.inlineCritical;
  const modifySource = options?.modifySource;

  if ((inlineCritical === true && !inlinePath)) {
    throw new Error("gulp-extract-critical-css: You have set `inlineCritical` to be true, however no `inlinePath` is set. Please use `inlinePath` to set a path to the file where your </head> element exists.");
  }

  return through.obj(
    function (file, encoding, callback) {
      if (file.isNull()) {
        return callback(null, file);
      }

      if (file.isStream()) {
        return callback(new Error("gulp-extract-critical-css: Streaming not supported"));
      }

      if (file.isBuffer()) {
        try {
            const { contents, criticalCss } = extractCriticalCss.call(
                this,
                file,
                file.contents.toString()
            );

            if (inlineCritical && inlinePath) {
                const inlineContents = fs.readFileSync(inlinePath, {
                encoding: "utf8",
                });
                    const headEnding = "</head>";
                    const startMarker = "<!-- CRITICAL CSS:START -->";
                    const endMarker = "<!-- CRITICAL CSS:END -->";
                    const headIndex = inlineContents.indexOf(headEnding);
                    const startIndex = inlineContents.indexOf(startMarker);
                    const endIndex = inlineContents.indexOf(endMarker);

                if (startIndex !== -1 && endIndex !== -1) { //If HTML Markers Exist Already
                    const contentBefore = inlineContents.slice(0, startIndex + startMarker.length);
                    const contentAfter = inlineContents.slice(endIndex);
                    const criticalStyle = `\n<style>\n${criticalCss}</style>\n`;
                    const modifiedContents = contentBefore + criticalStyle + contentAfter;
                    fs.writeFileSync(inlinePath, modifiedContents);
                }else{
                    const contentBefore = inlineContents.slice(0, headIndex);
                    const contentAfter = inlineContents.slice(headIndex);
                    const criticalStyle = `<!-- CRITICAL CSS:START -->\n<style>\n${criticalCss}</style>\n<!-- CRITICAL CSS:END -->\n`;
                    const modifiedContents = contentBefore + criticalStyle + contentAfter;
                    fs.writeFileSync(inlinePath, modifiedContents);
                }
            } else {
                this.criticalCss = this.criticalCss || "";
                this.criticalCss += criticalCss;
            }
            
            if (modifySource === true){
                file.contents = Buffer.from(contents);
            }

            this.push(file);

        } catch (err) {

          this.emit("error", err);
          
        }
      }

      callback();
    },
    function (callback) {
      if (!inlineCritical && this.criticalCss) {
        const criticalFile = new Vinyl({
          path: "critical.css",
          contents: Buffer.from(this.criticalCss),
        });

        this.push(criticalFile);
      }

      callback();
    }
  );
};