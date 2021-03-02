//用于生成和解析token
let jwt = require('jsonwebtoken');					// 获取token包
let signkey = 'this_is_sqm_blog_backstage_token';   // 定义token密钥

// 生成token
exports.setToken = function(userid){
	return new Promise((resolve,reject)=>{
		const token = jwt.sign({
		_id:userid
		},signkey,{ expiresIn:'3 days' });
		resolve(token);
	});
};

// 解析token
exports.verToken = function(token){
	return new Promise((resolve,reject)=>{
		var info = jwt.verify(token.split(' ')[1],signkey);
		resolve(info);
	});
};