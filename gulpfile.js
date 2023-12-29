const { src, dest, parallel } = require("gulp");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const purgecss = require("gulp-purgecss");
const uglifycss = require("gulp-uglifycss");

function javascript() {
  return (
    src("src/**/*.js")
      // The gulp-uglify plugin won't update the filename
      .pipe(uglify())
      // So use gulp-rename to change the extension
      .pipe(rename({ extname: ".min.js" }))
      .pipe(dest("dist/"))
  );
}

function css() {
  const filesToExclude = [
    "src/css/vendors/bootstrap.css",
    "src/css/customjs.css",
  ];

  const excludePattern = filesToExclude.map((file) => `!${file}`);

  return src(["src/**/*.css", ...excludePattern])
    .pipe(
      purgecss({
        content: ["src/**/*.php"],
      })
    )
    .pipe(rename({ extname: ".min.css" }))
    .pipe(
      uglifycss({
        maxLineLen: 80,
        uglyComments: true,
      })
    )
    .pipe(dest("dist/"));
}

function copyFiles() {
  return src("src/{css/vendors/bootstrap.css,css/customjs.css}").pipe(
    dest("dist/")
  );
}

exports.default = parallel(javascript, css, copyFiles);
