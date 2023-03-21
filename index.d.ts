declare module 'gulp-extract-critical-css' {
    import { Transform } from 'stream';
    import Vinyl from 'vinyl';
  
    interface GulpExtractCriticalCssOptions {}
  
    function gulpExtractCriticalCss(
      options?: GulpExtractCriticalCssOptions,
    ): Transform;
  
    export = gulpExtractCriticalCss;
}