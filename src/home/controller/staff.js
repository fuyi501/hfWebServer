'use strict';

import Base from './base.js';
const fse = require('fs-extra');

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {

    this.assign("title", "员工数据")
    return this.display();
  }
  setCorsHeader() {
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    this.header('Access-Control-Allow-Headers', 'Authorization,Content-Type,X-Requested-With');
    this.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
    this.header('Access-Control-Allow-Credentials', 'true');
  }
  // 查询员工数据
  async searchAction() {
    console.log("查询员工数据")
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log(data)
      if(data.staffInfo.staff_id !== '' && data.staffInfo.name !== ''){
        let res = await this.model("staff_info").where({staff_id: ['like', '%'+data.staffInfo.staff_id+'%'], name: ['like', '%'+data.staffInfo.name+'%']}).select();
        console.log('res:', res)
        this.success(res)
      }else if(data.staffInfo.staff_id !== ''){
        let res = await this.model("staff_info").where({staff_id: ['like', '%'+data.staffInfo.staff_id+'%']}).select();
        console.log('res:', res)
        this.success(res)
      } else if(data.staffInfo.name !== ''){
        let res = await this.model("staff_info").where({name: ['like', '%'+data.staffInfo.name+'%']}).select();
        console.log('res:', res)
        this.success(res)
      } else {
        let res = await this.model("staff_info").select();
        console.log('res:', res)
        this.success(res)
      }
    } else {
      this.fail('请求方法不对')
    }
  }
  // 批量删除用户数据
  async deletemanystaffinfoAction() {
    console.log("批量删除用户数据")
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log(data)

      data.deleteStaffInfo.forEach(async element => {
        console.log(element)
        let res = await this.model("staff_info").where({staff_id: element.staff_id}).delete(element);
        console.log('删除成功:', res)
  
        if(element.photo_name !== ''){
          console.log('删除人脸照片')

          // 需要修改的路径
          // 15服务器
          // 第一张保存的路径
          // let save1path = '/DATACENTER3/huifu/HuiFu_Project/staff_photo/' + element.staff_id + '_' + element.name + '.jpg'
          // // 另外五张保存的路径
          // let save2path = '/DATACENTER3/huifu/HuiFu_Project/update_face_lib/staff_face_ysd/' + element.staff_id + '/'

          // 汇富工厂
          let save1path = '/DATACENTER1/huifu/HuiFu_Project/staff_photo/' + element.staff_id + '_' + element.name + '.jpg'
          let save2path = '/DATACENTER1/huifu/generate_feature_lib/staff_face_ysd/' + element.staff_id + '/'
          
          
          fse.remove(save1path, err => {
            if (err) return console.error(err)
          
            console.log('删除第一张成功!')
          })
          fse.remove(save2path, err => {
            if (err) return console.error(err)
          
            console.log('删除另外五张成功!')
          })
        }
      })

      this.success({
        code: 2000,
        desc: "删除成功"
      })
    } else {
      this.fail('请求方法不对')
    }
  }
}