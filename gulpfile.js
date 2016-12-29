// -- require ---------------------------------------------------------------

const gulp = require("gulp")
const path = require("path")
const plug = require("gulp-load-plugins")({
  "pattern": "*",
  "rename": {
    "eslint": "Eslint",
    "gulp-if": "gulpIf",
    "riot": "Riot"
  }
})
const proc = require("child_process")

// -- const -----------------------------------------------------------------

const EXT = "xhtml"
const CWD = process.cwd()
const SRC = path.join(CWD, "code")
const TMP = path.join(CWD, "copy")
const OUT = path.join(CWD, "docs")

// -- opts ------------------------------------------------------------------

const opts = new function () {
  return {
    "autoprefixer": {
      "browsers": plug.browserslist([">0.25% in my stats"], {
        "stats": ".caniuse.json"
      }),
      "cascade": false,
      "remove": true
    },
    "babel": {
      "plugins": ["check-es2015-constants",
        "transform-es2015-arrow-functions",
        "transform-es2015-block-scoped-functions",
        "transform-es2015-block-scoping", "transform-es2015-classes",
        "transform-es2015-computed-properties",
        "transform-es2015-destructuring",
        "transform-es2015-duplicate-keys", "transform-es2015-for-of",
        "transform-es2015-function-name", "transform-es2015-literals",
        "transform-es2015-object-super", "transform-es2015-parameters",
        "transform-es2015-shorthand-properties",
        "transform-es2015-spread", "transform-es2015-sticky-regex",
        "transform-es2015-template-literals",
        "transform-es2015-typeof-symbol",
        "transform-es2015-unicode-regex", "transform-regenerator"]
    },
    "changedInPlace": {
      "firstPass": true
    },
    "cssbeautify": {
      "autosemicolon": true,
      "indent": "  "
    },
    "csslint": {
      "adjoining-classes": false,
      "box-model": true,
      "box-sizing": false,
      "bulletproof-font-face": true,
      "compatible-vendor-prefixes": false,
      "display-property-grouping": true,
      "duplicate-background-images": true,
      "duplicate-properties": true,
      "empty-rules": true,
      "fallback-colors": true,
      "floats": true,
      "font-faces": true,
      "font-sizes": true,
      "gradients": true,
      "ids": true,
      "import": true,
      "important": true,
      "known-properties": true,
      "order-alphabetical": false,
      "outline-none": true,
      "overqualified-elements": true,
      "qualified-headings": true,
      "regex-selectors": true,
      "shorthand": true,
      "star-property-hack": true,
      "text-indent": true,
      "underscore-property-hack": true,
      "unique-headings": true,
      "universal-selector": true,
      "unqualified-attributes": true,
      "vendor-prefix": true,
      "zero-units": true
    },
    "cssnano": {
      "autoprefixer": {
        "add": true,
        "browsers": plug.browserslist([">0.25% in my stats"], {
          "stats": ".caniuse.json"
        })
      }
    },
    "eslint": {
      "fix": true
    },
    "ext": {
      "es6": "*.@(e|j)s?(6|x)",
      "riot": "*.tag",
      "sass": "*.s@(a|c)ss",
      "slim": "*.sl?(i)m",
      "svg": "*.svg",
      "tag": /\.tag/
    },
    "filter": {
      "a": ["*", "!**/*.min.js"],
      "b": {
        "restore": true
      }
    },
    "htmlmin": function (min) {
      return {
        "collapseWhitespace": min,
        "keepClosingSlash": true,
        "minifyURLs": true,
        "removeComments": true,
        "removeScriptTypeAttributes": true,
        "removeStyleLinkTypeAttributes": true,
        "useShortDoctype": true
      }
    },
    "htmltidy": {
      "doctype": "html5",
      "indent": true,
      "indent-spaces": 2,
      "input-xml": true,
      "logical-emphasis": true,
      "new-blocklevel-tags": "",
      "output-xhtml": true,
      "quiet": true,
      "sort-attributes": "alpha",
      "tidy-mark": false,
      "wrap": 78
    },
    "jsbeautifier": {
      "js": {
        "file_types": [".es6", ".js", ".json"],
        "break_chained_methods": true,
        "end_with_newline": true,
        "indent_size": 2,
        "jslint_happy": true,
        "keep_array_indentation": true,
        "keep_function_indentation": true,
        "max_preserve_newlines": 2,
        "space_after_anon_function": true,
        "wrap_line_length": 78
      }
    },
    "rename": {
      "html": {
        "extname": `.${EXT}`
      }
    },
    "restart": {
      "args": ["-e", 'activate app "Terminal"', "-e",
        'tell app "System Events" to keystroke "k" using command down'],
      "files": ["config.rb", "gulpfile.js", "package.json", "yarn.lock"]
    },
    "riot": function (min) {
      return {
        "compact": min
      }
    },
    "sass": function (min) {
      return {
        "outputStyle": min ? "compressed" : "expanded"
      }
    },
    "slim": function (min) {
      return {
        "chdir": true,
        "options": ["attr_quote='\"'", `format=:${EXT}`, "shortcut={ " +
          "'.' => { attr: 'class' }, '@' => { attr: 'role' }, " +
          "'&' => { attr: 'type', tag: 'input' }, '#' => { attr: 'id' }, " +
          "'%' => { attr: 'itemprop' }, '^' => { attr: 'data-is' } }",
          "sort_attrs=true"],
        "pretty": !min,
        "require": "slim/include"
      }
    },
    "trimlines": {
      "leading": false
    },
    "uglify": function (min, tag) {
      return {
        "compress": {
          "warnings": false
        },
        "mangle": min,
        "output": {
          "beautify": !min,
          "comments": false,
          "indent_level": 2,
          "preamble": tag ? "/*! github.com/ptb, @license Apache-2.0 */" : ""
        },
        "sourceMap": true
      }
    },
    "umd": [
      "(function (root, factory) {\n" +
        "  if (typeof define === \"function\" && define.amd) {\n" +
        "    define([\"riot\"], factory)\n" +
        "  } else if (typeof module === \"object\" && module.exports) {\n" +
        "    factory(require(\"riot\"))\n" +
        "  } else {\n" +
        "    factory(root.riot)\n" +
        "  }\n" +
        "}(this, function (riot) {\n  ",
      "}))"
    ],
    "watch": {
      "ignoreInitial": false
    }
  }
}()

// -- tidy ------------------------------------------------------------------

const tidy = {
  "code": function (files, base) {
    return gulp.src(files, {
      "base": base
    })
      .pipe(plug.changedInPlace(opts.changedInPlace))
      .pipe(plug.trimlines(opts.trimlines))
  },
  "es6": function () {
    return plug.lazypipe()
      .pipe(plug.jsbeautifier, opts.jsbeautifier)
      .pipe(plug.jsbeautifier.reporter)
      .pipe(plug.eslint, opts.eslint)
      .pipe(plug.eslint.format)
  },
  "sass": function () {
    return plug.lazypipe()
      .pipe(plug.csscomb)
      .pipe(plug.sassLint)
      .pipe(plug.sassLint.format)
  },
  "slim": function () {
    return plug.flatmap(function (stream, file) {
      proc.spawn("slim-lint", [file.path], {
        "stdio": "inherit"
      })
      return stream
    })
  },
  "wrap": function (el, min) {
    return plug.lazypipe()
      .pipe(plug.gulpIf, !min, plug.injectString.prepend("\n"))
      .pipe(plug.injectString.prepend, `<${el}>`)
      .pipe(plug.injectString.append, `</${el}>`)
      .pipe(plug.gulpIf, !min, plug.injectString.append("\n"))
  }
}

// -- task ------------------------------------------------------------------

const task = {
  "css": function (min, tag) {
    return plug.lazypipe()
      .pipe(plug.autoprefixer, opts.autoprefixer)
      .pipe(plug.gulpIf, !min, plug.cssbeautify(opts.cssbeautify))
      .pipe(plug.gulpIf, !min, plug.csslint(opts.csslint))
      .pipe(plug.gulpIf, !min, plug.csslint.formatter("compact"))
      .pipe(plug.gulpIf, tag, plug.indent())
      .pipe(plug.gulpIf, min, plug.cssnano(opts.cssnano))
      .pipe(plug.gulpIf, tag, tidy.wrap("style", min)())
      .pipe(plug.gulpIf, tag, plug.indent())
  },
  "html": function (lint, min, tag) {
    return plug.lazypipe()
      .pipe(plug.rename, opts.rename.html)
      .pipe(plug.gulpIf, !min, plug.htmltidy(opts.htmltidy))
      .pipe(plug.gulpIf, lint, plug.w3cjs())
      .pipe(plug.gulpIf, min, plug.htmlmin(opts.htmlmin(min)))
      .pipe(plug.gulpIf, tag, plug.indent())
  },
  "js": function (min, wrap, tag) {
    var filter = plug.filter(opts.filter.a, opts.filter.b)

    return plug.lazypipe()
      .pipe(function () {
        return filter
      })
      .pipe(plug.gulpIf, !min, plug.jsbeautifier(opts.jsbeautifier))
      .pipe(plug.gulpIf, !min, plug.eslint(opts.eslint))
      .pipe(function () {
        return filter.restore
      })
      .pipe(plug.gulpIf, wrap, plug.indent())
      .pipe(plug.gulpIf, min, plug.uglify(opts.uglify(min, tag)))
      .pipe(plug.gulpIf, wrap, tidy.wrap("script", min)())
      .pipe(plug.gulpIf, wrap, plug.indent())
  },
  "svg": function (min, tag) {
    return plug.lazypipe()
      .pipe(plug.gulpIf, !min, plug.htmltidy(opts.htmltidy))
      .pipe(plug.gulpIf, min, plug.svgmin())
      .pipe(plug.gulpIf, tag, plug.indent())
  }
}

// -- gulp ------------------------------------------------------------------

gulp.task("default", function serve (done) {
  gulp.watch(opts.restart.files)
    .on("change", function () {
      if (process.platform === "darwin") {
        proc.spawn("osascript", opts.restart.args)
      }
      plug.kexec(process.argv.shift(), process.argv)
    })

  gulp.watch(path.join(SRC, "**", opts.ext.es6), opts.watch)
    .on("all", function (evt, file) {
      var es6, filter

      if (["add", "change"].includes(evt)) {
        filter = plug.filter(opts.filter.a, opts.filter.b)
        es6 = tidy.code(file, SRC)
          .pipe(filter)
          .pipe(tidy.es6()())
          .pipe(gulp.dest(SRC))
          .pipe(filter.restore)
          .pipe(plug.ignore.exclude(opts.ext.tag))
          .pipe(plug.babel(opts.babel))
        es6.pipe(plug.clone())
          .pipe(task.js(false, false, false)())
          .pipe(gulp.dest(TMP))
        es6.pipe(task.js(true, false, false)())
          .pipe(gulp.dest(OUT))
      }
    })

  gulp.watch(path.join(SRC, "**", opts.ext.riot, "*"), opts.watch)
    .on("all", function (evt, file) {
      var riot = function (dir, base, min) {
        var tag = path.basename(dir).split(".")[0]

        return plug.streamqueue.obj(
          gulp.src(path.join(dir, opts.ext.slim), {
            "base": base
          })
          .pipe(plug.slim(opts.slim(min)))
          .pipe(task.html(false, min, true)()),

          gulp.src(path.join(dir, opts.ext.svg), {
            "base": base
          })
          .pipe(task.svg(min, true)()),

          gulp.src(path.join(dir, opts.ext.sass), {
            "base": base
          })
          .pipe(plug.sass(opts.sass(min)))
          .pipe(task.css(min, true)()),

          gulp.src(path.join(dir, opts.ext.es6), {
            "base": base
          })
          .pipe(plug.babel(opts.babel))
          .pipe(task.js(min, true, false)())
        )
        .pipe(plug.concat(`${tag}.tag`))
        .pipe(plug.gulpIf(min, plug.injectString.append("\n")))
        .pipe(plug.injectString.prepend(`<${tag}>\n`))
        .pipe(plug.injectString.append(`</${tag}>\n`))
        .pipe(plug.rename({
          "dirname": path.relative(base, path.dirname(dir))
        }))
      }

      if (["add", "change"].includes(evt)) {
        riot(path.dirname(file), SRC, false)
          .pipe(gulp.dest(TMP))
        riot(path.dirname(file), SRC, true)
          .pipe(gulp.dest(OUT))
          .pipe(plug.riot(opts.riot(true)))
          .pipe(plug.injectString.prepend(opts.umd[0]))
          .pipe(plug.injectString.append(opts.umd[1]))
          .pipe(task.js(true, false, true)())
          .pipe(gulp.dest(TMP))
          .pipe(gulp.dest(OUT))
      }
    })

  gulp.watch(path.join(SRC, "**", opts.ext.sass), opts.watch)
    .on("all", function (evt, file) {
      var sass

      if (["add", "change"].includes(evt)) {
        sass = tidy.code(file, SRC)
          .pipe(tidy.sass()())
          .pipe(gulp.dest(SRC))
          .pipe(plug.ignore.exclude(opts.ext.tag))
        sass.pipe(plug.clone())
          .pipe(plug.sass(opts.sass(false)))
          .pipe(task.css(false, false)())
          .pipe(gulp.dest(TMP))
        sass.pipe(plug.sass(opts.sass(true)))
          .pipe(task.css(true, false)())
          .pipe(gulp.dest(OUT))
      }
    })

  gulp.watch(path.join(SRC, "**", opts.ext.slim), opts.watch)
    .on("all", function (evt, file) {
      if (["add", "change"].includes(evt)) {
        tidy.code(file, SRC)
          .pipe(tidy.slim())
          .pipe(gulp.dest(SRC))
      }
    })

  gulp.watch(path.join(SRC, "**", opts.ext.svg), opts.watch)
    .on("all", function (evt, file) {
      var svg

      if (["add", "change"].includes(evt)) {
        svg = tidy.code(file, SRC)
        svg.pipe(plug.clone())
          .pipe(task.svg(false, false)())
          .pipe(gulp.dest(SRC))
          .pipe(plug.ignore.exclude(opts.ext.tag))
          .pipe(gulp.dest(TMP))
        svg.pipe(plug.ignore.exclude(opts.ext.tag))
          .pipe(task.svg(true, false)())
          .pipe(gulp.dest(OUT))
      }
    })

  done()
})
