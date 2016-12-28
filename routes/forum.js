//论坛路由版块
var express = require('express');
var router = express.Router();
var forum = require('../controllers/forum');

//新建一个帖子
router.post('',function(req,res){
	forum.newTopic(req,res);
})

//更新帖子
router.put('/:pid',function(req,res){
	forum.changeTopic(req,res);
})

//删除帖子
router.delete('/:pid',function(req,res){
	forum.deleteTopic(req,res);
})

//回复帖子
router.post('/:pid/reply',function(req,res){
	forum.newReply(req,res);
})

//获取帖子列表
router.get('',function(req,res){
	forum.getTopics(req,res);
})

//获取一个帖子的详情
router.get('/:pid',function(req,res){
	forum.getTopic(req,res);
})

module.exports = router;