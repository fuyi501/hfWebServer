'use strict';

import Base from './base.js';
var schedule = require('node-schedule');
var dayjs = require('dayjs')

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {

    let res = []

    var j = schedule.scheduleJob('*/10 * * * * *', async () => {
      console.log('date:', dayjs().format('YYYY-MM-DD HH:mm:ss'));
      res = await this.model('staff_info').where('note != "" AND note != "null" AND working_state = "临时工" ').select();
      // console.log('res:', res)
      res.forEach(element => {
        console.log(element.note, '时间相差：', dayjs(element.note).diff(dayjs(), 'day'), dayjs(element.note).isSame(dayjs().format('YYYY-MM-DD'))); // true)
        if(dayjs(element.note).isSame(dayjs().format('YYYY-MM-DD'))){
          console.log('删除过期临时员工', element.staff_id, element.name, element.note)
        }
      });
      return this.success({
        desc: '定时任务',
        data: res
      });
    });

    

    this.assign("title", "定时任务")
    
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