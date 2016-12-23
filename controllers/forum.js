var mysqlUtil = require('../util/mysqlUtil');
var async = require('async');

exports.newTopic = function(req,res){
	async.waterfall([
			function(callback){
				callback(null,req.get('Authorization'));
			},
			getUserByToken,
			function(user,callback){
				mysqlUtil.query({
					sql: 'insert into forum (title,name,content,time,click,reply,avator) values ' + 
					'(?,?,?,?,?,?,?)',
					params: [
						req.body.title,
						user.name,
						req.body.content,
						Date.now(),
						0,
						0,
						user.avator
					]
				},function(err,rows){
					callback(err,rows);
				})
			}
		],function(err,results){
			if(handleErr(err,req,res)){
				return;
			}
			res.statusCode = 201;
			res.send({
				code: 0,
				msg: '',
				data: {
					pid: results[0].id
				}
			})
		});
}


exports.changeTopic = function(req,res){
	async.waterfall([
			function(callback){
				callback(null,req.get('Authorization'));
			},
			getUserByToken,
			function(user,callback){
				mysqlUtil.query({
					sql: 'update forum set (title,content) values (?,?) where mail = ?',
					params: [
						req.body.title,
						req.body.content,
						user.mail
					]
				},function(err,rows){
					callback(err,rows);
				})
			}
		],function(err,results){
			if (handleErr(err,req,res)) {
				return;
			}
			res.statusCode = 200;
			res.send({
				code: 0,
				msg: '',
				data: {
					pid: results.id
				}
			})
		});
}

exports.deleteTopic = function(req,res){
	async.waterfall([
			function(callback){
				callback(null,req.get('Authorization'));
			},
			getUserByToken,
			function(user,callback){
				mysqlUtil.query({
					sql: 'delete * from forum where mail = ?',
					params: [
						user.mail
					]
				},function(err,rows){
					callback(err,user);
				})
			},
			function(user,callback){
				mysqlUtil.query({
					sql: 'delete * from forum where id = ?',
					params: [
						req.params.pid
					]
				},function(err,rows){
					callback(err,user);
				})
			},
			function(user,callback){
				mysqlUtil.query({
					sql: 'delete * from reply where pid = ?',
					params: [
						req.params.pid
					]
				},function(err,rows){
					callback(err,user);
				})
			}
		],function(err,results){
			if(handleErr(err,req,res)){
				return;
			}
			res.statusCode = 200;
			res.send({
				code: 0,
				msg: ''
			})
		})
}

exports.newReply = function(req,res){
	async.waterfall([
			function(callback){
				callback(null,req.get('Authorization'));
			},
			getUserByToken,
			function(user,callback){
				mysqlUtil.query({
					sql: 'insert into reply (pid,name,avator,content,time,mail) values (?,?,?,?,?,?)',
					params: [
						req.params.pid,
						user.name,
						user.avator,
						req.body.content,
						Date.now(),
						user.mail
					]
				},function(err,rows){
					callback(err,rows);
				})
			},
			function(rows,callback){
				mysqlUtil.query({
					sql: 'update topic set time = ? where id = ?',
					params: [
						rows[0].time,
						rows[0].pid
					]
				},function(err,rows){
					callback(err,rows);
				})
			}
		],function(err,results){
			if(handleErr(err,req,res)){
				return;
			}
			res.statusCode = 200;
			res.send({
				code: 0,
				msg: ''
			})
		})
}

exports.getTopics = function(req,res){
	mysqlUtil.query({
		sql: 'select * from forum order by time'
	},function(err,rows){
		if (err) {
			res.statusCode = 500;
			return res.send({
				code: 1,
				msg: err
			})
		}
		res.statusCode = 200;
		var postList = [];
		for (var i = 0; i < rows.length(); i ++) {
			postList.push(rows[i]);
		}
		res.send({
			code: 0,
			msg: '',
			data: postList
		});
	})	
}

exports.getTopic = function(req,res){
	var topic;
	var replys = [];
	async.waterfall([
			function(callback){
				callback(null,req.params.pid);
			},
			function(pid,callback){
				mysqlUtil.query({
					sql: 'select * from forum where id = ?',
					params: [
						pid
					]
				},function(err,rows){
					callback(err,rows[0]);
				})
			},
			function(result,callback){
				result.mail = null;
				top = result;
				mysqlUtil.query({
					sql: 'select * from reply where pid = ?',
					params: [
						req.params.pid
					]
				},function(err,rows){
					for(var i = 0;i < rows.length();i ++){
						rows[i].id = null;
						rows[i].mail = null;
						replys.push(rows[i]);
					}
					callback(err,rows);
				})
			}
		],function(err,rows){
			if(err){
				res.statusCode = 500;
				return res.send({
					code: 1,
					msg: err
				});
			}

			res.statusCode = 200;
			res.send({
				code: 0,
				msg: '',
				data: {
					topic: topic,
					replys: replys					
				}
			})
		})
}

function getUserByToken(token,callback){
	mysqlUtil.query({
		sql: 'select * from user where token = ?',
		params: [
			token
		]
	},function(err,rows){
		if (err) {
			return callback(err,null);
		}
		if (rows.length == 0) {
			return callback('permission limit',null);	
		}
		callback(null,rows[0]);
	})
}

// return true if has error
function handleErr(err,req,res){
	if (err == 'permission limit') {
		res.statusCode = 403;
		res.send({
			code: 3,
			msg: '用户权限不够'
		});
		return true;
	}else if(err){
		res.statusCode = 500;
		res.send({
			code: 1,
			msg: 'server err'
		});
		return true;
	}
	return false;
}

