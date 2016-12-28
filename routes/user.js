//用户路由模块
var express = require('express');
var router = express.Router();
var user = require('../controllers/user')

//用户注册
router.post('/register',function (req,res) {
    user.addUser(req,res);
});

//用户登录
router.post('/login',function (req,res) {
    user.getToken(req,res);
});

//更改用户信息
router.put('/',function(req,res){
	user.changeUserInfo(req,res);
})

module.exports = router;
