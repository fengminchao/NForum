rootUrl: 182.254.247.206:5656
静态文件部署 url: 182.254.247.206:9080

# 用户相关

## 注册
- url: /api/user/register
- method: POST
- body: 

```
{
	mail:"xxxx",
	pwd:"xxxx",
}
``` 

- return：

```
{
	code:0,
	msg:""
}
```

```
201: created
500: server error
```

## 登录
- url: /api/user/login
- method: POST
- body: 

```
{
	mail:"xxxx",
	pwd:"xxx"
}
```

- return:

```
{
	code:0,
	msg:"",
	data:{
		name:"xxx",
		mail:"xxx",
		gender:"xx",
		age:xx,
		avator:"url"	
	}
}
```

```
200: login success
403: permission limit
500: server error
```

## 更改用户信息

- url: /api/user/
- method: PUT
- header: Authorization: token
- body:

```
{
	mail: 'xxx',
	pwd: 'xxx',
	name: 'xxx',
	avator: 'xxx',
	gender: 'xx',
	age: xx
}
```

- return:

```
{
	code: 0,
	msg: ''
}
```

```
200: ok
403: permission limit
500: server error
```

# 论坛相关

## 新建帖子
- url: /api/posts
- method: POST
- header: Authorization:token
- body:

```
{
	title:"xx",
	content:"xx"
}
```

- return:

```
{
	code:0,
	msg:"xx",
	data:{
		pid:2321
	}
}
```

```
201:new ok
403:permission limit
500:server error
```

## 更改帖子
- url: /api/posts/:pid
- method: PUT
- header: Authorization:token 
- body:

```
{
	title:'xx',
	content:'xx'
}
```

- return:

```
{
	code:0,
	msg:'',
	data:{
		pid:xx
	}
}
```

```
200:ok
403:permission limit
500:server err
```

## 删除帖子
- url: /api/posts/:pid
- method: DELETE
- header: Authorization: token || admin: admin

- return:

```
{
	code: 0,
	msg: ''
}
```

```
200: ok
403: permission limit
500: server err
```



## 回复帖子 
- url: /api/posts/:pid/reply
- method: POST
- header: Authorization: token
- body:

```
{
	content:'xx'
}
```

- return:

```
{
	code:0,
	msg: ''
}
```

```
200:ok
403:permission limit
500:server err
```

## 获取帖子列表
- url:/api/posts
- method: GET
- return:

```
{
	code:0,
	msg:'',
	data:[
		{
		pid:xx,
		title:'xx',
		name:'xx',
		avator:'url',
		content:'xx',(简短的内容)
		time: xxx(时间戳),
		click:xx,
		reply:xx
	},
	...
	]
}
```

```
200: ok
500: server error
```

## 获取帖子详情
- url:/api/posts/:pid
- method: GET
- return:

```
{
	code:0,
	msg: '',
	data:{
		topic:{
		pid:xx,
		title:'xx',
		name:'xx',
		avator:'url',
		content:'xx',
		time:xxx,
		click:xx,
		reply:xx
		},
		replys:[
			{
				pid:xx,(当前帖子的p id)
				name:'xx',
				avator:'url',
				content:'xx',
				time:xxx（时间戳
			},
			...
		]
	}	
}
```

