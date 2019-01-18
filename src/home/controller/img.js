'use strict';

import Base from './base.js';
const base64Img = require('base64-img');
const exec = require('child_process').exec;
const fs = require('fs');
const fse = require('fs-extra')

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {

    this.assign("title", "图片处理")
    return this.display();
  }
  setCorsHeader() {
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    this.header('Access-Control-Allow-Headers', 'Content-Type');
    // this.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
  }
  // 将大图变成小图
  async bigtosmallAction() {
    console.log("将大图裁剪成小图")
    this.setCorsHeader()
    if (this.isPost()) {
      let imgInfo = this.post()
      console.log("imgInfo:",imgInfo.staffInfo.staff_id) // { staff_id: '2', name: '撒地方', count: 5 }
      let bigImgInfo = imgInfo.bigImgInfo
      let imgName = imgInfo.staffInfo.staff_id
      // console.log("bigImgInfo:",bigImgInfo)
      // 裁剪人脸的 python 脚本路径
      let filename = '/DATACENTER1/huifu/generate_feature_lib/update_face_lib_dlib.py'
      let saveBigpath = think.RESOURCE_PATH + '/static/img/' + imgName // 保存大图的路径
      let saveSmallpath = think.RESOURCE_PATH + '/static/tempimg/' + imgName // 保存小图的路径
      
      // 判断保存大图的路径是否存在
      fs.exists(saveBigpath, (isexist) => {
        if (!isexist) {
          console.log("目录不存在，创建目录")
          fs.mkdir(saveBigpath, (err) => {
            if (!err) {
              console.log('创建目录成功')
              // 先将所有的大图保存到一个文件夹中
              bigImgInfo.forEach(element => {
                console.log(element.name, element.url.substring(0, 50), element.name.split('.')[0].split('_')[2], element.name.substr(-5, 5))
                // base64Img.base64Sync(smallPath + element.small_picture)
                let filepath = base64Img.imgSync(element.url, saveBigpath, String(Number(element.name.substr(-5, 1))-1));
                console.log(filepath)
              });

              // 调用 python 脚本裁剪人脸，返回是否裁剪成功
              exec('python ' + filename + ' ' + saveBigpath + ' ' + saveSmallpath, (err, stdout, stdin) => {
                console.log('裁剪人脸')
                if (err) {
                  console.log('err错误', err)
                  this.success({
                    code: 2001,
                    desc: "裁剪失败"
                  })
                }
                if (stdout) {
                  // parse the string
                  console.log('stdout:', stdout.replace(/[\r\n]/g, ""))
                  stdout = stdout.replace(/[\r\n]/g, "")
                  console.log('上传且裁剪成功')
                  this.success({
                    code: 2000,
                    smallPath: saveSmallpath,
                    desc: "裁剪成功"
                  })
                }
              });
            } else {
              console.log("创建目录失败：", err)
            }
          })
        } else {
          console.log("路径存在", saveBigpath)
          // 先将所有的大图保存到一个文件夹中
          bigImgInfo.forEach(element => {
            console.log(element.name, element.url.substring(0, 50), element.name.split('.')[0].split('_')[2], element.name.substr(-5, 5))
            // base64Img.base64Sync(smallPath + element.small_picture)
            let filepath = base64Img.imgSync(element.url, saveBigpath, String(Number(element.name.substr(-5, 1))-1));
            console.log(filepath)
          });

          // 调用 python 脚本裁剪人脸，返回是否裁剪成功
          exec('python ' + filename + ' ' + saveBigpath + ' ' + saveSmallpath, (err, stdout, stdin) => {
            console.log('裁剪人脸')
            if (err) {
              console.log('err错误', err)
              this.success({
                code: 2001,
                desc: "裁剪失败"
              })
            }
            if (stdout) {
              // parse the string
              console.log('stdout值:', stdout)
              // stdout = stdout.replace(/[\r\n]/g, "")
              if(stdout === 'success'){
                console.log('上传且裁剪成功')
                this.success({
                  code: 2000,
                  desc: "裁剪成功"
                })
              } else {
                stdout = stdout.split(',').filter(element => {
                  if(element !== '') return element
                }).sort()
                console.log('部分裁剪失败', stdout)
                this.success({
                  code: 2002,
                  errList: stdout,
                  desc: "部分裁剪失败"
                })
              }
              
            }
          });
        }
      })

    } else {
      this.fail('请求方法不对')
    }
  }
  // 将裁剪后的图片保存到指定路径下
  async savesmallpicAction() {
    console.log("将裁剪后的图片保存到指定路径下")
    this.setCorsHeader()
    if (this.isPost()) {
      let imgInfo = this.post()
      console.log("imgInfo:",imgInfo.staffInfo) // { staff_id: '2', name: '撒地方', count: 5 }

      // 第一张保存的路径
      let save1path = '/DATACENTER1/huifu/HuiFu_Project/staff_photo/' + imgInfo.staffInfo.staff_id + '_' + imgInfo.staffInfo.name + '.jpg'
      // 另外五张保存的路径
      let save2path = '/DATACENTER1/huifu/generate_feature_lib/staff_face_ysd/' + imgInfo.staffInfo.staff_id + '/'

      let saveSmallpath1 = think.RESOURCE_PATH + '/static/tempimg/' + imgInfo.staffInfo.staff_id + '/0.jpg' // 保存第一张小图的路径
      let saveSmallpath2 = think.RESOURCE_PATH + '/static/tempimg/' + imgInfo.staffInfo.staff_id + '/' // 保存其他小图的路径
      
      // 先保存第一张图片
      fs.exists(save1path, (isexist) => {
        if (!isexist) {
          // With a callback:
          fse.copy(saveSmallpath1, save1path, err => {
            if (err) return console.error(err)
            console.log('第一张图片保存成功!')
          }) // copies file

        } else {
          console.log("路径存在", save1path)
        }
      })

      // 保存其他的图片到指定目录下
      fs.exists(save2path, (isexist) => {
        if (!isexist) {
          console.log("目录不存在，创建目录")
          fs.mkdir(save2path, (err) => {
            if (!err) {
              console.log('创建目录成功')
              // With a callback:
              fse.copy(saveSmallpath2, save2path, err => {
                if (err) return console.error(err)
                console.log('其余图片保存成功!')
                this.success({
                  code: 2000,
                  desc: "其余图片保存成功"
                })
              }) // copies file
            } else {
              console.log("创建目录失败：", err)
            }
          })
        } else {
          console.log("路径存在", save2path)
          this.success({
            code: 2002,
            desc: "该图片已存在，是否覆盖更新"
          })
        }
      })

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
      let filename = '/DATACENTER1/huifu/generate_feature_lib/update_face_lib.py'
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
      // else {
      //   this.success({
      //     code: 2001,
      //     desc: "没有需要更新的"
      //   })
      // }

      if(data.type === 'delete') {
        console.log('删除数据后更新')
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
  // 获取用户数据
  async getstaffinfoAction() {
    this.setCorsHeader()
    let data = await this.model('staff_info').select();
    console.log("data:", data);
    return this.success(data);
  }
}