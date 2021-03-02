module.exports = class OtherUtils{
	constructor(params){
		this.init();
	};
	// 初始化
	init(){};
	/** 更改对象键名称
	*	@param		obj			[Object]	传入的对象
	*	@param		original	[Array]		更改前的键名
	*	@param		change		[Array]		更改后的键名
	*/
	changeObjKey = (obj,original,change)=>{
		if(original.length > 0 && change.length > 0){
			// 改变对象键值时
			if(original.length != change.length){
				console.error('需确保要更改的键名是对应关系');
				return false;
			};
			original.map((e,i) => {
				if(!obj[e]){
					console.error('对象中必须含有更改前的键名');
					return false;
				};
				obj[change[i]] = obj[e];	// 添加新属性
				delete obj[e];				// 去除旧属性
			});
		};
	};
	/**	检测对象中是否含有对应键值
	 *	@param		obj		[Object]		传入的对象
	 *	@param		arr		[Array]			要检测的键名
	 *	@return		is		[Boolean]		true 包含，false 存在不包含
	 */
	checkObjKeys(obj,arr){
		let is = true;
		arr.forEach(e => {
			if(!Object.keys(obj).includes(e)){
				is = false;
			};
		});
		return is;
	};
};