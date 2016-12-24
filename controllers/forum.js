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
					sql: 'insert into forum (title,name,content,time,click,reply,avator,mail) values ' + 
					'(?,?,?,?,?,?,?,?)',
					params: [
						req.body.title,
						user.name,
						req.body.content,
						Date.now(),
						0,
						0,
						user.avator,
						user.mail
					]
				},function(err,rows){
					callback(err,rows);
				})
			},
			function(rows,callback){
				mysqlUtil.query({
					sql: 'select max(id) from forum'
				},function(err,rows){
					callback(err,rows);
				})
			}
		],function(err,results){
			if(handleErr(err,req,res)){
				return;
			}
			// console.log(results);
			res.statusCode = 201;
			res.send({
				code: 0,
				msg: '',
				data: {
					pid: results[0]['max(id)']
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
					sql: 'update forum set title = ?,content = ? where id = ? and mail = ?',
					params: [
						req.body.title,
						req.body.content,
						req.params.pid,
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
					pid: req.params.pid
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
					sql: 'delete from forum where id = ? and mail = ?',
					params: [
						req.params.pid,
						user.mail
					]
				},function(err,rows){
					callback(err,user);
				})
			},
			function(user,callback){
				mysqlUtil.query({
					sql: 'delete from reply where pid = ?',
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
	var replyTime = Date.now();
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
						replyTime,
						user.mail
					]
				},function(err,rows){
					callback(err,rows);
				})
			},
			function(results,callback){
				mysqlUtil.query({
					sql: 'select * from forum where id = ?',
					params: [
						req.params.pid
					]
				},function(err,rows){
					callback(err,rows);
				})
			},
			function(results,callback){
				mysqlUtil.query({
					sql: 'update forum set time = ? ,reply = ? where id = ?',
					params: [
						replyTime,
						results[0].reply + 1,
						req.params.pid
					]
				},function(err,rows){
					callback(err,rows);
				});
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
		for (var i = 0; i < rows.length; i ++) {
			postList.push(rows[i]);
			postList[i].pid = postList[i].id;
			delete postList[i].id;
			delete postList[i].mail;
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
				result.pid = result.id;
				delete result.id;
				delete result.mail;
				topic = result;
				mysqlUtil.query({
					sql: 'select * from reply where pid = ?',
					params: [
						req.params.pid
					]
				},function(err,rows){
					for(var i = 0;i < rows.length;i ++){
						rows[i].id = null;
						rows[i].mail = null;
						delete rows[i].id;
						delete rows[i].mail;	
						replys.push(rows[i]);
					}
					callback(err,rows);
				});
				console.log(result.click);
				mysqlUtil.query({
					sql: 'update forum set click = ? where id = ?',
					params: [
						result.click + 1,
						req.params.pid
					]
				},function(err,rows){
					console.log(err);
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
	console.log(Date.now());
	console.log(err);
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

