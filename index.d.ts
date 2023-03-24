declare module 'gulp-extract-critical-css' {
    import { Transform } from 'stream';
    
    interface Options {
      inlinePath?: string;
      inlineCritical?: boolean;
      modifySource?: boolean;
    }
    
    function extractCriticalCss(file: Vinyl, contents: string): { contents: string, criticalCss: string };
    
    function gulpExtractCriticalCss(options?: Options): Transform;
    
    export = gulpExtractCriticalCss;
  }