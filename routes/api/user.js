const express = require('express');
const router = express.Router();
const db = require('../../utils/db');
const SqlUtils = require('../../utils/sqlUtils');
const OtherUtils = require('../../utils/otherUtils');
let otherUtils = new OtherUtils;
const { setToken } = require('../../token');

// 访问登录api
router.get('/', function(req, res, next) {
	res.render('index',{
		title: 'user',
		content: '用户相关功能api'
	});
});

// 用户登录,生成token
router.post('/login', function (req, res) {
	let resBody = {flag:0};

	let body = req.body;
	if(!otherUtils.checkObjKeys(body,['id','password'])){
		// 如果请求中不含有对应键值
		res.status(233).send('需要账户密码');
		return false;
	};
	db.query(`select \`id\` FROM user where id=${body.id} AND password=${body.password}`,(err,data)=>{
		if(err){
			// 如果有错误
			resBody.msg = '数据库错误';
			res.status(250).send(resBody);
			return false;
		}
		if(!data[0]){
			// 如果没有查到数据
			resBody.msg = '账号密码错误'
			res.status(233).send(resBody);
			return false;
		}
		resBody.flag = 1;
		//生成token
		resBody.dataInfo =	setToken(body.id).then(data => {
			resBody.dataInfo = {token:data};
			db.query(`UPDATE user SET \`token\`='${data}' WHERE (\`id\`='${body.id}')`,()=>{
				// 向数据库插入token并发送回token
				res.json(resBody);
			});
		});
	});
})

// 用户列表api
router.get('/list', (req, res) => {
	let resBody = {flag:0};
	// flag定义是否错误(0错误，1正确)，dataInfo为返回数据，msg为错误信息
	db.query('SELECT * FROM user',function(err,data){
		if(err){
			// 如果有错误
			resBody.msg = '数据库错误'
			resBody.flag = 0;
			return false;
		}
		resBody.flag = 1;
		resBody.dataInfo = data.map(e => {
			delete e.password;			// 不暴露密码
			return e;
		});
		res.send(resBody);				// 相应get
	});
});

// 添加用户
router.post('/addUser', function (req, res) {
	let resBody = {flag:0};
	
	let reqHandle = new SqlUtils(req);			// 实例化对象请求工具
	let insert =  reqHandle.post.insertAll();	// 将post请求体对应插入数据库

	db.query(`INSERT INTO user (${insert[0]}) VALUES (${insert[1]})`,function(err,data){
		if(err){
			resBody.msg = '数据库错误'
			resBody.flag = 0;
			return false;
		};
		resBody.flag = 1;
		resBody.dataInfo = 'success';
		res.send(resBody);
	});
});

// 更新用户数据
router.post('/updateUser', function (req, res) {
	let resBody = {flag:0};
	
	let reqHandle = new SqlUtils(req);			// 实例化对象请求工具
	let update =  reqHandle.post.updateAll();	// 将post请求体对应插入数据库

	db.query(`UPDATE user SET ${update[0]} WHERE (${update[1]})`,function(err,data){
		if(err){
			resBody.msg = '数据库错误'
			resBody.flag = 0;
			return false;
		};
		resBody.flag = 1;
		resBody.dataInfo = 'success';
		res.send(resBody);
	});
});

module.exports = router;