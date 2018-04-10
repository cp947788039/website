const BaseRest = require('../rest.js');

module.exports = class extends BaseRest {

	// 添加内容
	async postAction() {
		const userInfo = this.userInfo;
		let data = {
			uid: userInfo.id,
			title: this.post('title'),
			category_id: this.post('category_id'),
			slug: this.post('slug'),
			status: this.post('status'),
			markdown: this.post('markdown'),
			content: this.post('content'),
			slug: this.post('slug'),
			tag: this.post('tag'),
			view: 0,
			create_time: this.post('create_time') ? (new Date(this.post('create_time'))).getTime() / 1000 : (new Date()).getTime() / 1000
		}
		const id = this.modelInstance.insert(data);
		if (id) {
			return this.success({ id: id }, "添加成功");
		} else {
			return this.fail(1000, "添加失败");
		}
	}

	//更新内容
	async putAction() {
		const id = this.id;
		if (!this.id) {
			return this.fail(1001, '文章不存在');
		}
		let data = {
			title: this.post('title'),
			category_id: this.post('category_id'),
			slug: this.post('slug'),
			status: this.post('status'),
			markdown: this.post('markdown'),
			content: this.post('content'),
			slug: this.post('slug'),
			tag: this.post('tag'),
			view: 0,
			create_time: this.post('create_time') ? (new Date(this.post('create_time'))).getTime() / 1000 : (new Date()).getTime() / 1000
		}
		const res = this.modelInstance.save(id, data);
		if (res) {
			return this.success({ id: id }, "修改成功");
		} else {
			return this.fail(1000, "添加失败");
		}
	}

	//获取内容
	async getAction(){
		let data;
		let map = {};
		// 获取详情
		if (this.id) {
			map.slug=this.id;
			if (think.isEmpty(this.userInfo)){
				map.status=99;
			}
			data = await this.modelInstance.where(map).find();
			// 增加阅读量
			this.modelInstance.where(map).increment('view');
			return this.success(data);
		}
		// 获取列表
		const type=this.get('type')||'default';
		// 归档
		if (type == 'archives') {
			data = await this.modelInstance.where({ status: 99 }).order('id desc').fieldReverse('content,markdown').select();
			return this.success(data);
		}
		// 热门文章
		if (type=='hot'){
			data = await this.modelInstance.where({ status: 99 }).order('view desc').limit(10).field('title,view').select();
			return this.success(data);
		}
		// 是否获取全部
		const all=this.get('all');
		if(!all||think.isEmpty(this.userInfo)){
			map.status=99;
		}
		// 关键词
		const key=this.get('key');
		if(key){
			map['title|description'] = ['like', '%'+key+'%'];
		}
		//页码
		const page=this.get('page')||1;
		//每页显示数量
		const pageSize=this.get('pageSize')||5;
		data = await this.modelInstance.where(map).page(page,pageSize).order('id desc').fieldReverse('content,markdown').countSelect();
		return this.success(data);
	}

	//删除内容
	async deleteAction() {
		if (!this.id) {
			return this.fail(1001, '文章不存在');
		}
		const rows = await this.modelInstance.where({ id: this.id }).delete();
		if (rows) {
			return this.success({ affectedRows: rows }, "删除成功");
		} else {
			return this.fail(1000, "删除失败");
		}
	}
};
