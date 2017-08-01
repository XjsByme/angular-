var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglify');

gulp.task('styles', function() {
	gulp.src('src/css/app.less')
		.pipe(less())
		.pipe(gulp.dest('dist'));
	gulp.src('src/css/*')
		.pipe(gulp.dest('dist/css/'));
});

gulp.task('font',function(){
	gulp.src('src/font/*').pipe(gulp.dest('dist/font/'));
});

gulp.task('js',function(){
	gulp.src('src/js/*').pipe(gulp.dest('dist/js/'));
});

gulp.task('scripts', function() {
	return gulp.src(['src/app/**/*.js', 'src/app/*.js'])
		//.pipe(uglify())
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('views', function() {
	return gulp.src('src/app/**/*.html')
		.pipe(gulp.dest('dist/app'));
});

gulp.task('indexhtml', function() {
	return gulp.src('src/index.html')
		.pipe(gulp.dest('dist/'));
});

gulp.task('copyfiles', function() {
	gulp.src('src/css/*')
		.pipe(gulp.dest('dist/css/'));
	// gulp.src('src/css/**')
	//   .pipe(gulp.dest('dist/css/'));

	gulp.src('src/js/*')
		.pipe(gulp.dest('dist/js/'));
	// gulp.src('src/js/**')
	//   .pipe(gulp.dest('dist/js/'));

	gulp.src('src/img/*')
		.pipe(gulp.dest('dist/img/'));
	//gulp.src('src/img/**')
	//  .pipe(gulp.dest('dist/img/'));

	gulp.src('src/bower_components/angularjs/angular.min.js')
		.pipe(gulp.dest('dist/bower_components/angularjs/'));

	gulp.src('src/bower_components/jquery/dist/jquery.min.js') // src/bower_components/jquery/dist/jquery.min.js
		.pipe(gulp.dest('dist/bower_components/jquery/dist/'));

	gulp.src('src/bower_components/bootstrap/dist/**')
		.pipe(gulp.dest('dist/bower_components/bootstrap/dist/'));

	gulp.src('src/bower_components/angular-animate/angular-animate.min.js')
		.pipe(gulp.dest('dist/bower_components/angular-animate/'));

	gulp.src('src/bower_components/angular-ui-router/release/angular-ui-router.min.js')
		.pipe(gulp.dest('dist/bower_components/angular-ui-router/release/'));

	//  gulp.src('src/bower_components/bootstrap-modal/**')
	// .pipe(gulp.dest('dist/bower_components/bootstrap-modal/'));

	gulp.src('src/bower_components/ngdraggable/ngdraggable.js')
		.pipe(gulp.dest('dist/bower_components/ngdraggable/'));

	gulp.src('src/bower_components/ngstorage/ngStorage.js')
		.pipe(gulp.dest('dist/bower_components/ngstorage/'));

});


gulp.task('watch', function() {
	gulp.watch('src/css/*', ['styles']);
	gulp.watch('src/js/*', ['js']);
	gulp.watch(['src/app/**/*.js', 'src/app/*.js'], ['scripts']);
	gulp.watch('src/index.html', ['indexhtml']);
	gulp.watch('src/app/**/*.html', ['views']);
	gulp.watch('src/font/*',['font']);
	// Create LiveReload server
	livereload.listen();
	// Watch any files in dist/, reload on change
	gulp.watch(['dist/**']).on('change', livereload.changed);
});


gulp.task('default', ['copyfiles', 'styles','font', 'scripts', 'indexhtml', 'views', 'watch']);