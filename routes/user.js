var express = require('express');
var router = express.Router();
var user = require('../controllers/user')

router.post('/register',function (req,res) {
    user.addUser(req,res);
});

router.post('/login',function (req,res) {
    user.getToken(req,res);
});

router.put('/',function(req,res){
	user.changeUserInfo(req,res);
})

module.exports = router;
