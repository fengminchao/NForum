//导入 express 模块，是一个 web 开发框架
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var log4js = require('log4js');
var logger = require('morgan')

var user = require('./routes/user');
var forum = require('./routes/forum');

//启用打印日志，body 解析的中间件
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//路由分配
app.use('/api/user', user);
app.use('/api/posts',forum);

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//监听在5656端口
app.listen(5656,function(){
	console.log('app is running at 5656');
})