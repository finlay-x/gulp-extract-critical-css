const through = require("through2");
const Vinyl = require("vinyl");

const PLUGIN_NAME = "gulp-extract-critical-css";

module.exports = function () {
    let criticalCss = "";

    return through.obj(
        function (file, encoding, callback) {
            if (file.isNull()) {
                return callback(null, file);
            }

            if (file.isStream()) {
                return callback(
                    new Error("Streaming not supported")
                );
            }

            if (file.isBuffer()) {
                let contents = file.contents.toString();
                const startMarker = "/*! CRITICAL:START */";
                const endMarker = "/*! CRITICAL:END */";
                let startIndex = contents.indexOf(startMarker);

                while (startIndex !== -1) {
                    const endIndex = contents.indexOf(endMarker, startIndex);
                    if (endIndex === -1) {
                        return callback(
                            new Error("End marker not found in file!")
                        );
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

                file.contents = Buffer.from(contents);
                this.push(file);
                callback();
            }
        },
        function (callback) {
            const criticalFile = new Vinyl({
                path: "critical.css",
                contents: Buffer.from(criticalCss),
            });

            this.push(criticalFile);
            callback();
        }
    );
};