var conf = require('../conf');
var mysql = require('mysql');

var pool = null;

function initPool(){
	pool = mysql.createPool(conf.mysql);
}

initPool();

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

	pool.getConnection(function(err,connection){
		if (err) {
			return console.error(err);
		}

		connection.query(sql,sqlReq.params,function(err,rows){
			connection.release();
			callback(err,rows);
		})
	})
}