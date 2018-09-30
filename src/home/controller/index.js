'use strict';

import Base from './base.js';

const fs = require('fs');
export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }
  setCorsHeader(){
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    this.header('Access-Control-Allow-Headers', 'Content-Type');
    // this.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
  }
  // 保存拍摄的图片
  async savetableAction() {
    console.log("保存表格")
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log("data:",data)
      if (!think.isEmpty(data.tableInfo)) {
        if(data.tableType === 'staff'){
          let res = await this.model("teststaff").addMany(data.tableInfo)
          console.log('res:',res)
          return this.jsonp({code:2000,desc: "添加成功"})
        }else if(data.tableType === 'schedule'){
          let res = await this.model("testschedule").addMany(data.tableInfo[i])
          console.log('res:',res)
          return this.jsonp({code:2000,desc: "添加成功"})
        }else {
          return this.jsonp({code:2001,desc: "添加字段不对"})
        }
      }
    }else {
      this.fail('请求的方法不对')
    }
  }
  // 保存拍摄的图片
  async imgAction(){
    console.log("保存拍摄的图片")
    this.setCorsHeader()
    if (this.isPost()) {
      let imgInfo = this.post()
      // console.log("imgInfo:",imgInfo)
      imgInfo = imgInfo.imgInfo
      if(!think.isEmpty(imgInfo.name)){
        
        //接收前台POST过来的base64
        var imgData = imgInfo.url
        //过滤data:URL
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "")
        var dataBuffer = new Buffer(base64Data, 'base64')
        let savepath = think.RESOURCE_PATH + '\\upload\\faceimg\\' + imgInfo.name
        fs.exists(savepath, (isexist) => {
          console.log("isexist", isexist)
          if(!isexist){
            fs.writeFile(savepath, dataBuffer, (err) => {
              console.log("保存成功")
              return this.jsonp({code:2000,desc: "添加成功"})
            })
          }else{
            console.log("文件已存在")
            return this.jsonp({code:2001,desc: "文件已存在"})
          }
        })
      }
    } else {
      this.fail('请求方法不对')
    }
  }
  //保存上传的图片
  async saveimgAction() {
    this.setCorsHeader()
    if (this.isPost()) {
        let userInfo = this.post()
        console.log("userInfo:",userInfo)
        let userAvatar = this.file('avatar')
        console.log(userAvatar)
        if (userAvatar.originalFilename) {
          fs.readFile(userAvatar.path, (err, data) => {

            var imgType = userAvatar.originalFilename.split('.')[1]
            var newName = userInfo.uid  + '.' + imgType
            var savePath = think.RESOURCE_PATH + '\\upload\\avatar\\' + newName
            fs.exists(savePath, (isexist) => {
              console.log("isexist", isexist)
              if(!isexist){
                fs.writeFile(savePath, data, (err) => {
                  console.log("保存成功")
                  return this.jsonp({code:2000,desc: "添加成功"})
                })
              }else{
                console.log("文件已存在")
                return this.jsonp({code:2001,desc: "文件已存在"})
              }
            })
          })
        }else {
          return this.jsonp({code:2002,desc: "文件格式错误"})
        }
    } else {
        this.fail('请求方法不对')
    }
}
}