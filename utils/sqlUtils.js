// 用于请求处理为可执行的sql语句工具类
module.exports = class SqlUtils{
	constructor(req){
		this.req = req;		// 接收相应
		this.init();
	};
	init(){
		// post请求处理方法
		this.post = {
			/*	插入所有请求体中含有的对象
			*/
			insertAll: () => {
				if(!this.hasBody()){
					console.error('req.body异常');
					return [];
				};

				let keyArry = Object.keys(this.req.body);		// 获取键值名
				let valueArry = keyArry.map(e => {
					return this.req.body[e];
				});
				let keyString = keyArry.map(e => {
					return `\`${e}\``;
				});
				let valueString  = valueArry.map(e => {
					return `"${e}"`;
				});
				return [keyString.toString(),valueString.toString()];
			},
			/*	更新数据库中对象
			*	@param		sign	[string]	sql中用于定位的列，一般使用'id'
			*/
			updateAll: (sign='id')=>{
				if(!this.hasBody()){
					console.error('req.body异常');
					return [];
				};
				let body = this.req.body;
				let updateArry = Object.keys(body).filter(e => {
					if(e == sign){
						return false;
					}
					return true;
				});
				let updateString = updateArry.map((e,i)=>{
					return `\`${e}\`='${body[e]}'`;
				});
				let signString = `\`${sign}\`='${body[sign]}'`;
				return [updateString.toString(),signString];
			}
		}
	};
	// 判断 请求体有且有内容
	hasBody(){
		if(!this.req.body){
			// 没有请求体
			return false;
		};
		if(Object.keys(this.req.body).length == 0){
			// 请求体没有内容
			return false;
		};
		return true;
	};
};