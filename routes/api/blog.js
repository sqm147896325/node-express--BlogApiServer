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
        title: 'blog',
        content: '文章相关功能api'
    });
});

// 博客列表api
router.get('/list', (req, res) => {
	let resBody = {flag:0};
	// flag定义是否错误(0错误，1正确)，dataInfo为返回数据，msg为错误信息
	db.query('SELECT * FROM blog',function(err,data){
		if(err){
			// 如果有错误
			resBody.msg = '数据库错误'
			resBody.flag = 0;
            res.status(250).send(resBody);
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

// 添加博客
router.post('/addBlog', function (req, res) {
	let resBody = {flag:0};
	
	let reqHandle = new SqlUtils(req);			// 实例化对象请求工具
	let insert =  reqHandle.post.insertAll();	// 将post请求体对应插入数据库

	db.query(`INSERT INTO blog (${insert[0]}) VALUES (${insert[1]})`,function(err,data){
		if(err){
            console.log(err);
			resBody.msg = '数据库错误';
            resBody.flag = 0;
            res.status(250).send(resBody);
			return false;
		};
		resBody.flag = 1;
		resBody.dataInfo = 'success';
		res.send(resBody);
	});
});

// 更新博客数据
router.post('/updateBlog', function (req, res) {
	let resBody = {flag:0};
	
	let reqHandle = new SqlUtils(req);			// 实例化对象请求工具
	let update =  reqHandle.post.updateAll();	// 将post请求体对应插入数据库

	db.query(`UPDATE blog SET ${update[0]} WHERE (${update[1]})`,function(err,data){
		if(err){
			resBody.msg = '数据库错误'
			resBody.flag = 0;
            res.status(250).send(resBody);
			return false;
		};
		resBody.flag = 1;
		resBody.dataInfo = 'success';
		res.send(resBody);
	});
});

module.exports = router;