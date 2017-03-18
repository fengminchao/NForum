//用户逻辑模块
var mysqlUtil = require('../util/mysqlUtil');
var async = require('async'); 
var crypto = require('crypto');

exports.addUser = function(req,res){
	async.waterfall([
		function(callback){
			callback(null,req.body)
		},
		queryUser,
		insertUser,
		],function(err,result){
			if (err) {
				console.error(err);
				res.status = 500;
				return res.send({
					code: 1,
					msg: err
				});
			}
			res.status = 200;
			res.send({
				code: 0,
				msg: ''
			});

		})
}

exports.getToken = function(req,res){
	mysqlUtil.query({
		sql: 'select * from user where mail = ?',
		params:[
		req.body.mail
		]
	},function(err,rows){
		console.log(rows);
		console.log(rows[0]);
		if (err) {
			res.statusCode = 500;
			return res.send({
				code: 1,
				msg: err
			})
		}
		if (rows.length == 0) {
			res.statusCode = 403;
			res.send({
				code: 3,
				msg: '该邮箱不存在'
			});
			return;
		}
		if (rows[0].pwd == req.body.pwd) {

			async.waterfall([
					function(callback){
						callback(null,40,req.body.mail);
					},
					generateToken,
					saveToken
				],function(err,result){
					if(err){
						res.statusCode = 500;
						return res.send({
							code: 1,
							msg: '生成token失败'
						});
					}
					res.statusCode = 200;
					res.set('Cache-Control','public');
					res.send({
						code: 0,
						msg: '',
						data: {
							name: rows[0].name,
							mail: rows[0].mail,
							gender: rows[0].gender,
							age: rows[0].age,
							avator: rows[0].avator,
							token: result
						}
					});
				})
		}else{
			res.statusCode = 403;
			res.send({
				code: 3,
				msg: '密码错误'
			})
		}
	})
}

exports.changeUserInfo = function(req,res){
	var user = req.body;
	console.log(req.get('Authorization'));
	mysqlUtil.query({
		sql: 'update user set mail = ?,pwd = ? ,name = ? ,avator = ? ,gender = ? ,age = ? where token = ?',
		params:[
			user.mail,
			user.pwd,
			user.name,
			user.avator,
			user.gender,
			user.age,
			req.get('Authorization')
		]
	},function(err,rows){
		if (err) {
			res.statusCode = 500;
			return res.send({
				code: 1,
				msg: err
			});
		}
		if (rows.affectedRows > 0) {
			res.statusCode = 200;
			res.set('Cache-Control','public');
			return res.send({
				code: 0,
				msg: ''
			});
		}
		res.statusCode = 401;
		res.send({
			code: 1,
			msg: '认证失败'
		})
	})
}

function generateToken(length,mail,callback){
	crypto.randomBytes(length,function(err,buffer){
		callback(err,buffer.toString('hex'),mail);
	});
}

function saveToken(token,mail,callback){
	console.log(token);
    mysqlUtil.query({
        sql: 'update user set token = ? where mail = ?',
        params: [
        token,
        mail
        ]
    }, function (err, rows) {
        console.log(rows);
        if (err) {
            callback(err, null);
        } else {
            callback(null,token);
        }
    })

}

function queryUser(user,callback){
	mysqlUtil.query({
		sql: 'select * from user where mail = ?',
		params: [
		user.mail
		]
	},function(err,rows){
		if(err){
			return callback(err);	
		}
		if (rows.length > 0) {
			return callback('user has exists',null);
		}
		callback(null,user);
	});
}

function insertUser(user,callback){
	mysqlUtil.query({
		sql: 'insert into user (mail,pwd,name) values (?,?,?)',
		params: [
		user.mail,
		user.pwd,
		user.name
		]
	},function(err,rows){
		callback(err,rows);
	})
}