var gulp            = require('gulp'),
    jshint          = require('gulp-jshint'),
    sass            = require('gulp-ruby-sass'),
    sourcemaps      = require('gulp-sourcemaps'),
    browserSync     = require('browser-sync'),
    reload          = browserSync.reload,
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    imagemin        = require('gulp-imagemin'),
    minifyHTML      = require('gulp-minify-html'),
    autoprefixer    = require('gulp-autoprefixer'),
    cssmin          = require('gulp-cssmin'),
    uncss           = require('gulp-uncss'),
    processhtml     = require('gulp-processhtml'),

    // asset folders
    jsSrc           = 'js',
    jsLibSrc        = 'js/lib',
    cssSrc          = 'css',
    sassSrc         = 'sass',
    imageSrc        = 'images',
    buildPath       = 'dist';

// DEV ---------------------------------------------------------------------- */
gulp.task('jshint', function() {
    gulp.src(jsSrc + '/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('serve', ['sass'], function() {
    browserSync({
        server: "."
    });

    gulp.watch(sassSrc + "/*.scss", ['sass']);
    gulp.watch("*.html").on('change', reload);
});

gulp.task('sass', function () {
    return sass(sassSrc, { sourcemap: true })
        .on('error', function(err){
                console.err('Error', err.message);
            })
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(cssSrc))
        .pipe(autoprefixer({
            browsers: ['> 2%'],
            cascade: false
        }))
        .pipe(reload({stream: true}));
});

// BUILD -------------------------------------------------------------------- */
gulp.task('optimize-js', function() {
    return gulp.src([jsSrc + '/*.js', jsLibSrc + '/*.js'])
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(gulp.dest(buildPath + '/js'));
});

gulp.task('optimize-images', function() {
     return gulp.src(imageSrc + '/*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(buildPath + '/images'));
});

gulp.task('optimize-css', function() {
    return sass(sassSrc)
        .pipe(gulp.dest(cssSrc))
        .pipe(uncss({
            html: ['*.html']
        }))
        .pipe(autoprefixer({
            browsers: ['> 2%'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(buildPath + '/css'));
});

gulp.task('optimize-html', function(){
    return gulp.src('*.html')
        .pipe(processhtml())
        .pipe(minifyHTML())
        .pipe(gulp.dest(buildPath));
});

gulp.task('default', ['jshint', 'serve']);
gulp.task('production', ['optimize-js', 'optimize-images', 'optimize-css', 'optimize-html']);