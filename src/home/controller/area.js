'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {

    this.assign("title", "purcost")
    // return this.success(stu);
    return this.display();
    // return this.json(stu);
  }
  setCorsHeader() {
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    this.header('Access-Control-Allow-Headers', 'Content-Type');
    // this.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
  }
  // 获取数据
  async areainfoAction() {
    console.log("获取区域信息")
    this.setCorsHeader()
    let areaInfo = await this.model('area_info').select();
    // console.log("data:", data)
    let newdata = areaInfo.map((element, index) => {
      return {
        area_name: element.area_name,
        ch_name: element.ch_name,
        isforbidden: element.is_forbidden
      }
    })
    console.log(newdata)

    return this.jsonp(newdata);
  }
  //修改区域信息
  async editareainfoAction() {
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log(data)
      let res = await this.model("area_info").where({
        area_name: data.areaData.area_name
      }).update(data.areaData);
      console.log('res:', res)
      console.log('更新成功')
      this.success({
        code: 2000,
        desc: "更新成功"
      })
    } else {
      this.fail('请求方法不对')
    }
  }
}