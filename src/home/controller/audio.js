'use strict';

import Base from './base.js';

let AipSpeech = require("baidu-aip-sdk").speech;
let fs = require('fs');
var dayjs = require('dayjs');
var base64Img = require('base64-img');

// 替换百度云控制台中新建百度语音应用的 APPID 、Api Key 和 Secret Key
let client = new AipSpeech('15194283', 'nrrYN3OBLNpnRVi3Z6K2B9MH', 'lE5SlgBx3wdLce92obr7nm0EBUjBjCTL');

let location = {
    "Fnorth": "一车间一楼北楼梯间",
    "Fsouth": "一车间一楼南楼梯间",
    "Gate": "大门",
    "Lab": "实验楼",
    "Main_road": "盐酸小罐区主干道",
    "SWJTU": "西南交大9423实验室",
    "Sleft": "二车间一楼左侧楼梯口",
    "Sright": "二车间一楼右侧楼梯口",
    "Tank_eight": "原料大罐区8号罐",
    "Tank_four": "原料大罐区4号罐",
    "Tank_jl": "原料大罐区靠金陵路",
    "Tank_main": "原料大罐区主干道"
  }

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){

    this.assign("title","purcost")
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
  async playaudioAction(){
    console.log("语音测试")
    this.setCorsHeader()
    let alarmString = this.get()
    console.log(alarmString)
    let data = await this.model('event_info').where({status: '异常', channel_name: ['IN', alarmString.alarmString]}).order('id DESC').limit(20).select();
    data = data.reverse()
    // console.log("data:", data)
    let rootPath = '/DATACENTER1/huifu/image_cache/'
    let newdata = data.map((element, index) => {
        let bigPath = rootPath + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/big_picture/'
        let smallPath = rootPath + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/small_picture/'
        
        if (element.event === '职工') {
            return {
              id: element.id,
              text: element.id + ' ' + location[element.channel_name] + element.event + ' ' + element.person_name + ' ' + element.cause,
              src: 'http://192.168.100.240:8360/static/audio/' + location[element.channel_name] + element.event + element.cause + '.mp3',
              time: element.datetime,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture),
              small_picture: base64Img.base64Sync(smallPath + element.small_picture)
            }
        } else {
            return {
              id: element.id,
              text: element.id + ' ' + location[element.channel_name] + element.event,
              src: 'http://192.168.100.240:8360/static/audio/' + location[element.channel_name] + element.event + '.mp3',
              time: element.datetime,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture),
              small_picture: base64Img.base64Sync(smallPath + element.small_picture)
            }
        }
       
    })
    // console.log(newdata)

    // fs.existsSync(audiopath, (isexist) => {
    //     console.log("isexist", isexist)
    //     if (isexist) {
    //         audioUrl.push('http://localhost:8360/static/audio/' + element.text + '.mp3')
    //     } else {
            // 语音合成，保存到本地文件
            // client.text2audio(element.text, {spd: 5, per: 4}).then(function(result) {
            //     if (result.data) {
            //         console.log('进来了', element.text)
            //         fs.writeFileSync(think.RESOURCE_PATH + '/static/audio/' + element.text + '.mp3', result.data);

            //     } else {
            //         // 合成服务发生错误
            //         console.log('语音合成失败: ' + JSON.stringify(result));
            //     }
            // }, function(err) {
            //     console.log(err);
            // });
    //     }
    // })

    return this.jsonp(newdata);
  }
  // 定时获取数据
  async intervalgetAction(){
    console.log("定时获取数据")
    this.setCorsHeader()
    let alarmString = this.get()
    console.log(alarmString)
    let data = await this.model('event_info').where({status: '异常', channel_name: ['IN', alarmString.alarmString], id: ['>', alarmString.maxid]}).select();
    console.log("定时获取数据, 查到的数据data:", data, data.length)
    let rootPath = '/DATACENTER1/huifu/image_cache/'
    let newdata = data.map((element, index) => {
        let bigPath = rootPath + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/big_picture/'
        let smallPath = rootPath + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/small_picture/'
        
        if (element.event === '职工') {
            return {
              id: element.id,
              text: element.id + ' ' + location[element.channel_name] + element.event + ' ' + element.person_name + ' ' + element.cause,
              src: 'http://192.168.100.240:8360/static/audio/' + location[element.channel_name] + element.event + element.cause + '.mp3',
              time: element.datetime,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture),
              small_picture: base64Img.base64Sync(smallPath + element.small_picture)
            }
        } else {
            return {
              id: element.id,
              text: element.id + ' ' + location[element.channel_name] + element.event,
              src: 'http://192.168.100.240:8360/static/audio/' + location[element.channel_name] + element.event + '.mp3',
              time: element.datetime,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture),
              small_picture: base64Img.base64Sync(smallPath + element.small_picture)
            }
        }
       
    })

    return this.jsonp(newdata);
  }
  // 语音报警设置
  // 获取报警数据
  async getaudioAction() {
    this.setCorsHeader()
    let data = await this.model('alarm_setting').select();
    console.log("data:", data);
    return this.success(data);
  }
  //添加报警信息
  async addaudioAction() {
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log(data)
      let res = await this.model("alarm_setting").add(data.audioData)
      console.log('res:', res)
      console.log('添加成功')
      this.success({
        code: 2000,
        desc: "添加成功"
      })
    } else {
      this.fail('请求方法不对')
    }
  }
  //修改报警信息
  async editaudioAction() {
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log('获取到的数据', data)
      // 修改获取到的数据的 is_alarm 值为数值
      data.audioData.is_alarm = Number(data.audioData.is_alarm)
      console.log('修改后的数据', data)
      let res = await this.model("alarm_setting").where({
        id: data.audioData.id
      }).update(data.audioData);
      console.log('res:', res)
      console.log('编辑成功')
      this.success({
        code: 2000,
        desc: "编辑成功"
      })
    } else {
      this.fail('请求方法不对')
    }
  }
  //打开关闭所有报警信息
  async opencloseallAction() {
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log('获取到的数据', data)
      if(data.audioData === 'openall'){
        let res = await this.model("alarm_setting").where('1=1').update({is_alarm: 1});
        console.log('编辑成功:', res)
        this.success({
          code: 2000,
          desc: "修改成功"
        })
      }else if(data.audioData === 'closeall') {
        console.log('关闭所有：', data.audioData)
        let res = await this.model("alarm_setting").where('1=1').update({is_alarm: 0});
        console.log('编辑成功:', res)
        this.success({
          code: 2000,
          desc: "修改成功"
        })
      }
    } else {
      this.fail('请求方法不对')
    }
  }
  //删除数据
  async deleteaudioAction() {
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log(data)
      let res = await this.model("alarm_setting").where({
        id: data.audioData.id
      }).delete(data.audioData);
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