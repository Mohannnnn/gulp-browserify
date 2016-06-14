var gulp = require("gulp");
var browserify = require("browserify");
var sourcemaps = require("gulp-sourcemaps");
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var jshint = require('jshint');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var watch = require('gulp-watch');

gulp.task("browserify", function () {
    var b = browserify({
        entries: "./js/main.js",//需要打包的文件
        debug: true
    });

    return b.bundle()
        .pipe(source("bundle.js"))//打包后的文件
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./complied"));//将数据流写入文件
});

gulp.task('js', function () {//第一个参数是任务名，第二个参数是任务函数
  return gulp.src('js/*.js')//用于产生数据流，可以用数组来指定多个成员
    .pipe(jshint())
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build'));//将管道的输出文件写入文件，同时将这些输出继续输出，所以可以依次调用多次dest方法，将输出写入多个目录。如果有目录不存在，将会被新建
});
// gulp充分使用了“管道”思想，就是一个数据流（stream）：src方法读入文件产生数据流，dest方法将数据流写入文件，
// 中间是一些中间步骤，每一步都对数据流进行一些处理

gulp.task('build',['css','js','imgs']);
//先指定build任务，它由css、js、imgs三个任务所组成，指定按顺序运行的一组任务并发执行这三个任务。注意，由于每个任务都是异步调用，所以没有办法保证js任务的开始运行的时间，正是css任务运行结束

//task方法的回调函数，还可以接受一个函数作为参数，这对执行异步任务非常有用。
// 执行shell命令
var exec = require('child_process').exec;
gulp.task('jekyll', function(cb) {
  // 创建 Jekyll
  exec('jekyll build', function(err) {
    if (err) return cb(err); // return error
    cb(); // finished task
  });
});

//如果一个任务的名字为default，就表明它是“默认任务”，在命令行直接输入gulp命令，就会运行该任务。
gulp.task('default', function () {
  // Your default task
});
// 或者
gulp.task('default', ['styles', 'jshint', 'watch']);

//代码指定，一旦templates目录中的模板文件发生变化，就运行build任务。
gulp.task('watch', function () {
   gulp.watch('templates/*.tmpl.html', ['build']);
});

//watch方法也可以用回调函数，代替指定的任务。
gulp.watch('templates/*.tmpl.html', function (event) {
   console.log('Event type: ' + event.type);
   console.log('Event path: ' + event.path);
});

//另一种写法是watch方法所监控的文件发生变化时（修改、增加、删除文件），会触发change事件。可以对change事件指定回调函数。
var watcher = gulp.watch('templates/*.tmpl.html', ['build']);
watcher.on('change', function (event) {
   console.log('Event type: ' + event.type);
   console.log('Event path: ' + event.path);
});