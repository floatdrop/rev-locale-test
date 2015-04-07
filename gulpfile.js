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

clean = function(cb){
  $.del("./dist", cb);
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

gulp.task( "concatLocales", function(cb){
  var fileName, i, len, locale, locales;
  locales = ["en-us", "en-ca", "fr-CA"];
  var streamsDone = 0;
  for (i = 0, len = locales.length; i < len; i++) {
    locale = locales[i];
    fileName = locale + ".json";
        gulp.src( "./src/**/"+locale+".json" )
            .pipe( $.concat( {path:fileName, cwd:"./"}, {newLine:","} ) )
            .pipe( $.wrap("{ <%= contents %> }", {}, {parse:false}) )
            .pipe( $.jsonminify() )
            .pipe( $.rev() )
            .pipe( gulp.dest( "./dist/locales" ) )
            .on('end', function () {
                streamsDone ++;
                if (streamsDone >= locales.length) {
                    cb();
                }
            });
  }

});

gulp.task( "createLocaleManifest", function(){
  return gulp.src( "./dist/locales/*.json" )
    .pipe( $.rev() )
    .pipe( $.rev.manifest() )
    .pipe( gulp.dest( "dist" ) );
});
gulp.task( "locales", function(cb){
  $.runSequence( "concatLocales", "createLocaleManifest", cb);
});


// @floatdrop's initial suggested solution
// ----------------------------------------------
//
// gulp.task( "locales", function(){
//     var locales = ["en-us", "en-ca", "fr-CA"];
//     for (var )
//   gulp.src( "./src/**/.json" )
//     .pipe( $.concat( {path:'concated-locales.json', cwd:"./"}, {newLine:","} ) )
//     .pipe( $.wrap("{ <%= contents %> }", {}, {parse:false}) )
//     .pipe( $.jsonminify() )
//     .pipe( $.rev() )
//     .pipe( gulp.dest( "./dist/locales" ) )
//     .pipe( $.rev.manifest( {base: "./dist/rev", path:"locales.json", merge:true} ) )
//     .pipe( gulp.dest( "dist/rev" ) );
// });

// ----------------------------------------------
// Clean & Rebuild
// ----------------------------------------------
defaultTask = function(cb){
  $.runSequence("clean", "locales", cb);
};
gulp.task( "default", defaultTask );
