# gulp-extract-critical-css

## **Introduction**
A Gulp plugin to extract critical CSS from a source CSS file.

The plugin reads a CSS file and extracts the sections between the markers `/*! CRITICAL:START */` and `/*! CRITICAL:END */`. It concatenates all the extracted sections into a single string and creates a new file named critical.css in the output folder with this content.

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
| `inlineCritical` | Boolean | `false` | Create a critical.css or inline the critical CSS. |
| `inlinePath` | string | - | A path to a file that contains your closing `</head>` tag, this is where the inlined CSS will be appended. <br /> **Required if `inlineCritical` is set to `true`** |
| | | | |