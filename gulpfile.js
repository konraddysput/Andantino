var gulp = require('gulp'), 				// importing gulp package
	uglify =require('gulp-uglify'),			//importing gulp uglify to minify javascrit[]
	sass = require('gulp-ruby-sass'),		// importing gulp sass compiler
	plumber = require('gulp-plumber'),
	livereload = require('gulp-livereload')
	ts = require('gulp-typescript');
//Scripts Task
//Uglifies


gulp.task('libraries', function(){
	gulp.src('lib/*.js')			//load files
	.pipe(plumber())					//handling javascript errors
	.pipe(uglify())						//pipe allows us to run a commands on files - we use uglify
	.pipe(gulp.dest('Scripts'))		//we saving them - output
	.pipe(livereload()); 	
});


gulp.task('scripts', function(){
	gulp.src('Scripts/Build/*.js')			//load files
	.pipe(plumber())					//handling javascript errors
	.pipe(uglify())						//pipe allows us to run a commands on files - we use uglify
	.pipe(gulp.dest('Scripts'))		//we saving them - output
	.pipe(livereload()); 	
});

//Styles task
//Uglify sass to css
gulp.task('styles', function(){
	 return sass('Styles/Build/*.scss',{
	 	style:'compressed'
	 })
	.pipe(plumber())
    .on('error', sass.logError)
    .pipe(gulp.dest('Styles'))
    .pipe(livereload());
});

//TypeScript Compiler


gulp.task('typescript',function(){
	return gulp.src('Scripts/Build/*.ts')
				.pipe(ts({
					noImplicitAny: true,
					out: 'typescript-output.js'
						}))
				.pipe(gulp.dest('Scripts'))
				.pipe(livereload());
});


//Watch task
//JS watch
//SCSS watch
gulp.task('watch', function(){
	var server = livereload();

	gulp.watch('Scripts/Build/*.ts', ['typescript']);
	gulp.watch('Scripts/Build/*.js', ['scripts']);
	gulp.watch('lib/*.js', ['libraries']);
	gulp.watch('Styles/Build/*.scss',['styles']);
})




gulp.task('default', ['scripts','libraries', 'typescript','styles','watch']); //default - task name, array is a task array that have to be minified

