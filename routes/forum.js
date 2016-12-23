var express = require('express');
var router = express.Router();
var forum = require('../controllers/forum');

router.post('',function(req,res){
	forum.newTopic(req,res);
})

router.put('/:pid',function(req,res){
	forum.changeTopic(req,res);
})

router.delete('/:pid',function(req,res){
	forum.deleteTopic(req,res);
})

router.post('/:pid/reply',function(req,res){
	forum.newReply(req,res);
})

router.get('',function(req,res){
	forum.getTopics(req,res);
})

router.get('/:pid',function(req,res){
	forum.getTopic(req,res);
})

module.exports = router;