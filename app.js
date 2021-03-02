var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 数据库操作
const db = require('./utils/db');

// 路由获取
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

// token验证
const { verToken } = require('./token');
const expressJwt = require('express-jwt');

var app = express();

app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "content-type");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Content-Type", "application/json;charset=utf-8");
	res.header("Access-Control-Allow-Headers", "content-type,Authorization");		// 配置token
	next();
});

// 解析token获取用户信息
app.use(function(req, res, next) {
	var token = req.headers['authorization'];
	if(token == undefined){
		return next();
	}else{
		verToken(token).then((data)=> {
			// toekn正确且未过期

			let resBody = {flag:0};
			// 与数据库的token进行比对
			db.query(`select \`id\` FROM user where id=${data._id} AND token='${token.split(' ')[1]}'`,(err,data)=>{
				if(err){
					// 如果有错误
					console.log(err);
					resBody.msg = '数据库错误';
					res.status(400).send(resBody);
					return false;
				}
				if(!data[0]){
					// 如果没有查到数据
					resBody.msg = 'token被替换失效'
					res.status(400).send(resBody);
					return false;
				};
				return next();
			});
		}).catch((error)=>{
			// token错误或已过期
			res.status(422).send({
				flag: 0,
				msg: 'token错误或已过期'
			});
		})
	}
});

//验证token是否过期并规定哪些路由不用验证
app.use(expressJwt({
		secret: 'this_is_sqm_blog_backstage_token', // 密匙
		algorithms: ['HS256']
}).unless({
		path: ['/api/user/login','/api/user/addUser']//除了这些地址，其他的URL都需要验证
}));

// 当token失效返回提示信息
app.use(function(err, req, res, next) {
	if (err.status == 401) {
		return res.status(401).send('token错误');
	}
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 使用的路由
app.use('/', indexRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
