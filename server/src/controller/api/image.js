const BaseRest = require('../rest.js');
const fs = require('fs');
const path = require('path');
const rename = think.promisify(fs.rename, fs);

module.exports = class extends BaseRest {

	// 图片上传
	async postAction() {
		const file = this.file('image');
		if (!file) {
			return this.fail(1000, "请上传文件");
		}
		//path.extname获取文件后缀名，可做上传控制
		const extname = path.extname(file.name);
		const filename = path.basename(file.path);
		const basename = think.md5(filename) + extname;
		const savepath = '/upload/' + basename;
		const filepath = path.join(think.ROOT_PATH, "www" + savepath);
		think.mkdir(path.dirname(filepath));
		rename(file.path, filepath);
		return this.success({ url: savepath }, "上传成功");
	}
};
