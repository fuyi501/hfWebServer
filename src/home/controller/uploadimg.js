'use strict';

import Base from './base.js';

const fs = require('fs');
const fse = require('fs-extra');
const exec = require('child_process').exec;
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction() {
    //auto render template file index_index.html
    return this.display();
  }
  setCorsHeader() {
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    this.header('Access-Control-Allow-Headers', 'Authorization,Content-Type,X-Requested-With');
    this.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
    this.header('Access-Control-Allow-Credentials', 'true');
  }

  // 保存上传的图片
  async saveimgAction() {
    this.setCorsHeader()
    if (this.isPost()) {
      let userInfo = this.post()
      console.log("userInfo:", userInfo)
      let userAvatar = this.file('avatar')
      console.log(userAvatar)
      if (userAvatar.originalFilename) {
        fs.readFile(userAvatar.path, (err, data) => {

          var imgName =  userInfo.staff_id + '_' + userInfo.name + '.jpg'

          // 需要修改的路径
          // 第一张保存的路径
          // 15 服务器
          // let save1path = '/DATACENTER3/huifu/HuiFu_Project/staff_photo/' + imgName
          // // 另外五张保存的路径
          // let save2pathDir = '/DATACENTER3/huifu/HuiFu_Project/update_face_lib/staff_face_ysd/' + userInfo.staff_id + '/'
          // let save2path = '/DATACENTER3/huifu/HuiFu_Project/update_face_lib/staff_face_ysd/' + userInfo.staff_id + '/' + userAvatar.originalFilename.split('_')[2]

          // 汇富工厂
          let save1path = '/DATACENTER1/huifu/HuiFu_Project/staff_photo/' + imgName
          let save2pathDir = '/DATACENTER1/huifu/generate_feature_lib/staff_face_ysd/' + userInfo.staff_id + '/'
          let save2path = '/DATACENTER1/huifu/generate_feature_lib/staff_face_ysd/' + userInfo.staff_id + '/' + userAvatar.originalFilename.split('_')[2]

          console.log(save1path, save2pathDir, save2path)

          // 先保存第一张图片
          fs.exists(save1path, (isexist) => {
            console.log("是否已存在：", isexist)
            if (!isexist) {
              fs.writeFile(save1path, data, (err) => {
                console.log("不存在，准备保存")
                if (err === null) {
                  console.log("保存成功")
                  let res = this.model("staff_record").add({staff_id: userInfo.staff_id, name: userInfo.name, record_time: dayjs().format('YYYY-MM-DD HH:mm:ss')});
                  console.log('更新结果:', res)
                  // return this.jsonp({
                  //   code: 2000,
                  //   desc: "添加成功"
                  // })
                } else {
                  console.log("保存失败")
                  // return this.jsonp({
                  //   code: 2000,
                  //   desc: err
                  // })
                }
              })
            } else {
              console.log("文件已存在", save1path)
            }
          })

          // 保存其他的图片到指定目录下
          fs.exists(save2pathDir, (isexist) => {
            if (!isexist) {
              console.log("目录不存在，创建目录")
              fs.mkdir(save2pathDir, (err) => {
                if (!err) {
                  console.log('创建目录成功')
                  // 保存其他的图片到指定目录下
                  fs.exists(save2path, (isexist) => {
                    console.log("是否已存在：", isexist)
                    if (!isexist) {
                      fs.writeFile(save2path, data, (err) => {
                        console.log("不存在，准备保存")
                        if (err) return console.error(err)
                        console.log('其余图片保存成功!')
                        this.success({
                          code: 2000,
                          desc: "其余图片保存成功"
                        })
                      })
                    } else {
                      console.log("文件已存在", save2path)
                    }
                  })
                } else {
                  console.log("创建目录失败：", err)
                }
              })
            } else {
              console.log("路径存在", save2pathDir)
              // 保存其他的图片到指定目录下
              fs.exists(save2path, (isexist) => {
                console.log("是否已存在：", isexist)
                if (!isexist) {
                  fs.writeFile(save2path, data, (err) => {
                    console.log("不存在，准备保存")
                    if (err) return console.error(err)
                    console.log('其余图片保存成功!')
                    this.success({
                      code: 2000,
                      desc: "其余图片保存成功"
                    })
                  })
                } else {
                  console.log("文件已存在", save2path)
                }
              })
            }
          })
        })
      } else {
        return this.jsonp({
          code: 2002,
          desc: "文件格式错误"
        })
      }
    } else {
      this.fail('请求方法不对')
    }
  }

  // 更新人脸库
  async updatefaceAction() {
    console.log('更新人脸库')
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log(data)

      // 需要修改的路径
      let filename = '/DATACENTER3/huifu/HuiFu_Project/update_face_lib/update_face_lib.py' // 15服务器
      // let filename = '/DATACENTER1/huifu/generate_feature_lib/update_face_lib.py' // 汇富工厂

      if (data.updateStaffInfo.length > 0) {
        exec('python ' + filename, (err, stdout, stdin) => {
          console.log('更新人脸')

          if (err) {
            console.log('err', err)
          }
          if (stdout) {
            // parse the string
            console.log('stdout:', stdout.replace(/[\r\n]/g, ""))
            stdout = stdout.replace(/[\r\n]/g, "")
            if(stdout === 'regenerate_face_lib_succeed'){
              console.log('更新成功')
              data.updateStaffInfo.forEach(ele => {
                let res = this.model("staff_info").where({staff_id: ele.staff_id}).update({photo_name: ele.staff_id + '_' + ele.name + '.jpg'});
                console.log(ele, '更新结果:', res)
              })
              this.success({
                code: 2000,
                desc: "更新成功"
              })
            }else{
              console.log('更新失败')
              this.success({
                code: 2002,
                desc: stdout
              })
            }
          }
        });
      } 
    } else {
      this.fail('请求方法不对')
    }
  }

}