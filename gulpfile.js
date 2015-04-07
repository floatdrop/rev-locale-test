// ----------------------------------------------
// Init gulp
// ----------------------------------------------

gulp = require( "gulp" );
$ = require( "gulp-load-plugins" )();

// ----------------------------------------------
// Load misc plugins not covered by gulp-load-plugins
// ----------------------------------------------

$.path = require("path");
$.runSequence = require("run-sequence");
$.eventStream = require("event-stream"); // option?
$.del = require('del');
$.vinylPaths = require('vinyl-paths');

// ----------------------------------------------
// Clean /dist dir & rev manifest
// ----------------------------------------------

clean = function(){
  gulp.src( ["./dist/*"], {read: false} )
    .pipe( $.vinylPaths($.del) );
};
gulp.task( "clean", clean );

// ----------------------------------------------
// Copy locales to /config/locales
// ----------------------------------------------

// @uberspeck's initial broken attempt
// ----------------------------------------------

// gulp.task("locales", function(){
//   var fileName, i, len, locale, locales;
//   locales = ["en-us", "en-ca", "fr-CA"];
//   for (i = 0, len = locales.length; i < len; i++) {
//     fileName = "#{locale}.json"
//     gulp.src( "./src/**/"+locale+".json" )
//       .pipe( $.concat( {path:fileName, cwd:"./"}, {newLine:","} ) )
//       .pipe( $.wrap("{ <%= contents %> }", {}, {parse:false}) )
//       .pipe( $.jsonminify() )
//       .pipe( $.rev() )
//       .pipe( gulp.dest( "./dist/locales" ) )
//       .pipe( $.rev.manifest( {path:"locales.json", merge:true} ) )
//       .pipe( gulp.dest( "./dist/rev" ) )
//   }
// });

// @uberspeck's broken fix attempt
// ----------------------------------------------

// gulp.task( "concatLocales", function(){
//   var fileName, i, len, locale, locales;
//   locales = ["en-us", "en-ca", "fr-CA"];
//   for (i = 0, len = locales.length; i < len; i++) {
//     locale = locales[i];
//     fileName = locale + ".json";
//     gulp.src( "./src/**/"+locale+".json" )
//       .pipe( $.concat( {path:fileName, cwd:"./"}, {newLine:","} ) )
//       .pipe( $.wrap("{ <%= contents %> }", {}, {parse:false}) )
//       .pipe( $.jsonminify() )
//       .pipe( $.rev() )
//       .pipe( gulp.dest( "./dist/locales" ) );
//   }
// });
// gulp.task( "createLocaleManifest", function(){
//   gulp.src( "./dist/locales/*.json" )
//     .pipe( $.rev.manifest( {path:"locales.json", merge:true} ) )
//     .pipe( gulp.dest( "dist/rev" ) );
// });
// gulp.task( "locales", function(){
//   $.runSequence( "concatLocales", "createLocaleManifest" );
// });


// @floatdrop's initial suggested solution
// ----------------------------------------------

gulp.task( "locales", function(){
  gulp.src( "./src/**/{en-us,en-ca,fr-ca}.json" )
    .pipe( $.concat( {path:'concated-locales.json', cwd:"./"}, {newLine:","} ) )
    .pipe( $.wrap("{ <%= contents %> }", {}, {parse:false}) )
    .pipe( $.jsonminify() )
    .pipe( $.rev() )
    .pipe( gulp.dest( "./dist/locales" ) )
    .pipe( $.rev.manifest( {base: "/dist/rev", path:"locales.json", merge:true} ) )
    .pipe( gulp.dest( "dist/rev" ) );
});

// ----------------------------------------------
// Clean & Rebuild
// ----------------------------------------------
defaultTask = function(){
  $.runSequence("clean", "locales");
};
gulp.task( "default", defaultTask );
