var express = require('express');
var router = express.Router();
var user = require('../controllers/user')

router.post('/register',function (req,res) {
    user.addUser(req,res);
});

router.post('/login',function (req,res,err) {
    user.getToken(req,res,null);
});

module.exports = router;
