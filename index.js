const through = require("through2");
const Vinyl = require("vinyl");

const PLUGIN_NAME = "gulp-extract-critical-css";

function extractCriticalCss(file, contents) {
  const startMarker = "/*! CRITICAL:START */";
  const endMarker = "/*! CRITICAL:END */";

  let startIndex = contents.indexOf(startMarker);
  let criticalCss = "";

  while (startIndex !== -1) {
    const endIndex = contents.indexOf(endMarker, startIndex);
    if (endIndex === -1) {
        this.emit("error", new Error(`End marker not found in file ${file.relative} at index ${startIndex}`));
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

module.exports = function () {
  return through.obj(
    function (file, encoding, callback) {
      if (file.isNull()) {
        return callback(null, file);
      }

      if (file.isStream()) {
        return callback(new Error("Streaming not supported"));
      }

      if (file.isBuffer()) {
        try {
            const { contents, criticalCss } = extractCriticalCss.call(
                this,
                file,
                file.contents.toString()
            );

            file.contents = Buffer.from(contents);
            this.push(file);

            this.criticalCss = this.criticalCss || "";
            this.criticalCss += criticalCss;
        } catch (err) {
            this.emit("error", err);
        }
      }

      callback();
    },
    function (callback) {
      if (this.criticalCss) {
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