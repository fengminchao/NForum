//mysql的调用工具模块

//导入 conf 配置文件
var conf = require('../conf');
//导入 mysql 模块
var mysql = require('mysql');

var pool = null;

function initPool(){
	pool = mysql.createPool(conf.mysql);
}

//初始化数据库连接池
initPool();

//传递数据库请求
exports.query = function(sqlReq,callback){
	if (!pool) {
		initPool();
	}

	if (!sqlReq) {
		return console.error('this sqlReq is null');
	}

	var sql = sqlReq.sql || '';
	if(sql.length == 0){
		return console.error('ths sql is empty');
	}

//数据库连接池建立连接
	pool.getConnection(function(err,connection){
		if (err) {
			return console.error(err);
		}

		connection.query(sql,sqlReq.params,function(err,rows){
			//释放连接
			connection.release();
			callback(err,rows);
		})
	})
}