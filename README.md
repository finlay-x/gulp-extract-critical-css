# gulp-extract-critical-css

</br>

## **Introduction**
A Gulp plugin that allows you to extract critical CSS from a source CSS file. 

The plugin reads a CSS file and extracts the sections between the markers `/*! CRITICAL:START */` and `/*! CRITICAL:END */`. It concatenates all the extracted sections into a single string - through the plugin options you can choose to either output this critical CSS to a separate file named critical.css or inline it in to the end of the `<head>` section of a HTML file. The plugin also offers an option to modify the source CSS file by removing the critical CSS sections.

## **Installation**
You can install `gulp-extract-critical-css` using npm:
```
$   npm install gulp-extract-critical-css --save-dev
``` 

## **Usage**

### **Inside your gulpfile:**
```JavaScript
const gulp = require('gulp');
const extractCriticalCss = require('./extract-critical-css');

function criticalCSS() {
    return gulp.src('./dist/style.css')
      .pipe(extractCriticalCss())
      .pipe(gulp.dest('./dist/'));
}

exports.criticalCSS = series(criticalCSS)
```

### **Inside your ./dist/style.css file**
```CSS
/*! CRITICAL:START */
header {
    background: red;
}
/*! CRITICAL:END */

body {
    background: green;
}

footer {
    background: blue;
}
```


### **Expected Output Files**
The modified `./dist/style.css` :
```CSS
body {
    background: green;
}

footer {
    background: blue;
}
```

The generated `./dist/critical.css` :
```CSS
header {
    background: red;
}
```

### **Options:**
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `inlineCritical` | Boolean | `false` | Determines whether a critical.css file is generated or if the critical CSS gets inlined. |
| `inlinePath` | string | - | A path to a file that contains your closing `</head>` tag, this is where the inlined CSS will be appended. <br /> **Required if `inlineCritical` is set to `true`** |
| `modifySource` | Boolean | `false` | Determines whether the source file should be modified - setting to `true` will remove the critical CSS from the source file. |