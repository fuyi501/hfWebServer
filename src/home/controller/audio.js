'use strict';

import Base from './base.js';

let AipSpeech = require("baidu-aip-sdk").speech;
let fs = require('fs');
var dayjs = require('dayjs');
var base64Img = require('base64-img');

// 替换百度云控制台中新建百度语音应用的 APPID 、Api Key 和 Secret Key
let client = new AipSpeech('15194283', 'nrrYN3OBLNpnRVi3Z6K2B9MH', 'lE5SlgBx3wdLce92obr7nm0EBUjBjCTL');

const location = {
    "Fnorth": "一车间一楼北楼梯间",
    "Fsouth": "一车间一楼南楼梯间",
    "Gate": "大门",
    "Lab": "实验楼",
    "Main_road": "盐酸小罐区主干道",
    "Sleft": "二车间一楼左侧楼梯口",
    "Sright": "二车间一楼右侧楼梯口",
    "Tank_eight": "原料大罐区8号罐",
    "Tank_four": "原料大罐区4号罐",
    "Tank_jl": "原料大罐区靠金陵路",
    "Tank_main": "原料大罐区主干道",
    "Area_R1_124": "蒸汽罐",
    "Area_R2_70": "蒸汽缓冲罐",
    "Area_R3_96": "6线外主干道",
    "Area_R4_88": "包装车间大门",
    "Area_R5_77": "液碱罐区",
    "Area_R5_86": "盐酸大罐区3号罐旁",
    "Area_R6_82": "盐酸小罐区主干道",
    "Area_R6_116": "仓库外",
    "Area_R7_126": "一车间靠三期主干道",
    "Area_R8_80": "厂区内主干道",
    "Area_R9_137": "装卸区主干",
    "Area_R10_136": "廊桥2",
    "Area_R11_81": "仓库装货区",
    "Area_R12_114": "货运门",
    "Area_R13_139": "盐酸处理主干入侵报警",
    "Area_R14_102": "二期原料罐区",
    "Area_R15_105": "原料小罐区",
    "Area_R16_108": "机修间外侧",
    "Area_R17_101": "原料大罐区园区内",
    "Area_R18_104": "原料大罐区靠金陵路2",
    "Area_R19_107": "机修班靠金陵路",
    "Area_A6_98": "原料大罐区主干道",
    "Area_A6_94": "原料大罐区8号罐",
    "Area_A6_99": "原料大罐区南面主干道",
    "Area_A6_95": "原料大罐区4号罐",
    "Area_A7_91": "原料小罐区1",
    "Area_A7_83": "盐酸小罐区主干道2",
    "Area_A7_92": "原料小罐区2",
    "Area_A7_84": "水洗塔1"
  }

const areaRoad = {
  "侵入A1": "侵入棚区",
  "侵入A2": "侵入生产厂房",
  "侵入A3": "侵入液碱盐酸储罐",
  "侵入A4": "侵入一期生产装置",
  "侵入A5": "侵入三期生产装置",
  "侵入A6": "侵入装卸泵房",
  "侵入A7": "侵入一期成品仓库",
  "侵入A8": "侵入三期成品仓库",
  "侵入R1": "侵入道路1",
  "侵入R2": "侵入道路2",
  "侵入R3": "侵入道路3",
  "侵入R4": "侵入道路4",
  "侵入R5": "侵入道路5",
  "侵入R6": "侵入道路6",
  "侵入R7": "侵入道路7",
  "侵入R8": "侵入道路8",
  "侵入R9": "侵入道路9",
  "侵入R10": "侵入道路10",
  "侵入R11": "侵入道路11",
  "侵入R12": "侵入道路12",
  "侵入R13": "侵入道路13",
  "侵入R14": "侵入道路14",
  "侵入R15": "侵入道路15",
  "侵入R16": "侵入道路16",
  "侵入R17": "侵入道路17",
  "侵入R18": "侵入道路18",
  "侵入R19": "侵入道路19",
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
    let nowtime = dayjs().subtract(5, 'minute').format('YYYY-MM-DD HH:mm:ss')
    console.log('新的时间：', dayjs().format('YYYY-MM-DD HH:mm:ss'), nowtime)
    // let data = await this.model('event_info').where({status: '异常', channel_name: ['IN', alarmString.alarmString], datetime: ['>', nowtime]}).order('id DESC').limit(20).select();
    let data = await this.model('event_info').where({status: '异常', channel_name: ['IN', alarmString.alarmString], datetime: ['>', nowtime]}).limit(20).select();
    // data = data.reverse()
    console.log("定时获取数据, 查到的数据data:", data, '数据长度：', data.length)
    let rootPath = '/DATACENTER1/huifu/image_cache/'
    let rootPath2 = '/huifu2/huifu/HuiFu_Project/image_cache/'
    let newdata = data.map((element, index) => {
      
      if(element.category === 'area' || element.category === 'road') {
        let bigPath = rootPath2 + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/big_picture/'
        let smallPath = rootPath2 + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/small_picture/'
        
        if (element.event === '职工') {
            return {
              id: element.id,
              text: element.id + ' ' + location[element.channel_name] + element.event + ' ' + element.person_name + ' ' + element.cause,
              src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + element.event + element.cause + '.mp3',
              time: element.datetime,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture),
              small_picture: base64Img.base64Sync(smallPath + element.small_picture)
            }
        } else if (element.event === '外事员工'){
          return {
            id: element.id,
            text: element.id + ' ' + location[element.channel_name] + '外事人员' + areaRoad[element.cause],
            src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + '外事人员' + areaRoad[element.cause] + '.mp3',
            time: element.datetime,
            big_picture: base64Img.base64Sync(bigPath + element.big_picture),
            small_picture: base64Img.base64Sync(smallPath + element.small_picture)
          }
        } else if (element.event === '员工'){
          return {
            id: element.id,
            text: element.id + ' ' + location[element.channel_name] + '员工' + element.cause,
            src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + '员工' + element.cause + '.mp3',
            time: element.datetime,
            big_picture: base64Img.base64Sync(bigPath + element.big_picture),
            small_picture: base64Img.base64Sync(smallPath + element.small_picture)
          }
        } else {
            return {
              id: element.id,
              text: element.id + ' ' + location[element.channel_name] + element.event,
              src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + element.event + '.mp3',
              time: element.datetime,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture),
              small_picture: base64Img.base64Sync(smallPath + element.small_picture)
            }
        }

      } else {

        let bigPath = rootPath + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/big_picture/'
        let smallPath = rootPath + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/small_picture/'
        
        if (element.event === '职工') {
            return {
              id: element.id,
              text: element.id + ' ' + location[element.channel_name] + element.event + ' ' + element.person_name + ' ' + element.cause,
              src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + element.event + element.cause + '.mp3',
              time: element.datetime,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture),
              small_picture: base64Img.base64Sync(smallPath + element.small_picture)
            }
        } else if (element.event === '外事员工'){
            return {
              id: element.id,
              text: element.id + ' ' + location[element.channel_name] + '外事人员' + areaRoad[element.cause],
              src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + '外事人员' + areaRoad[element.cause] + '.mp3',
              time: element.datetime,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture),
              small_picture: base64Img.base64Sync(smallPath + element.small_picture)
            }
        } else if (element.event === '员工'){
          return {
            id: element.id,
            text: element.id + ' ' + location[element.channel_name] + '员工' + element.cause,
            src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + '员工' + element.cause + '.mp3',
            time: element.datetime,
            big_picture: base64Img.base64Sync(bigPath + element.big_picture),
            small_picture: base64Img.base64Sync(smallPath + element.small_picture)
          }
        } else {
            return {
              id: element.id,
              text: element.id + ' ' + location[element.channel_name] + element.event,
              src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + element.event + '.mp3',
              time: element.datetime,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture),
              small_picture: base64Img.base64Sync(smallPath + element.small_picture)
            }
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
    var data = ''
    if(alarmString.maxid){
      data = await this.model('event_info').where({status: '异常', channel_name: ['IN', alarmString.alarmString], id: ['>', alarmString.maxid]}).select();
    } else {
      let nowtime = dayjs().subtract(5, 'minute').format('YYYY-MM-DD HH:mm:ss')
      console.log('新的时间：', dayjs().format('YYYY-MM-DD HH:mm:ss'), nowtime)
      data = await this.model('event_info').where({status: '异常', channel_name: ['IN', alarmString.alarmString], datetime: ['>', nowtime]}).limit(20).select();

    }
    console.log("定时获取数据, 查到的数据data:", data, '数据长度：', data.length)

    let rootPath = '/DATACENTER1/huifu/image_cache/'
    let rootPath2 = '/huifu2/huifu/HuiFu_Project/image_cache/'

    let newdata = data.map((element, index) => {

      if(element.category === 'area' || element.category === 'road') {
        let bigPath = rootPath2 + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/big_picture/'
        let smallPath = rootPath2 + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/small_picture/'
        
        if (element.event === '职工') {
          return {
            id: element.id,
            text: element.id + ' ' + location[element.channel_name] + element.event + ' ' + element.person_name + ' ' + element.cause,
            src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + element.event + element.cause + '.mp3',
            time: element.datetime,
            big_picture: base64Img.base64Sync(bigPath + element.big_picture),
            small_picture: base64Img.base64Sync(smallPath + element.small_picture)
          }
        } else if (element.event === '外事员工'){
          return {
            id: element.id,
            text: element.id + ' ' + location[element.channel_name] + '外事人员' + areaRoad[element.cause],
            src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + '外事人员' + areaRoad[element.cause] + '.mp3',
            time: element.datetime,
            big_picture: base64Img.base64Sync(bigPath + element.big_picture),
            small_picture: base64Img.base64Sync(smallPath + element.small_picture)
          }
        } else if (element.event === '员工'){
          return {
            id: element.id,
            text: element.id + ' ' + location[element.channel_name] + '员工' + element.cause,
            src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + '员工' + element.cause + '.mp3',
            time: element.datetime,
            big_picture: base64Img.base64Sync(bigPath + element.big_picture),
            small_picture: base64Img.base64Sync(smallPath + element.small_picture)
          }
        } else {
          return {
            id: element.id,
            text: element.id + ' ' + location[element.channel_name] + element.event,
            src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + element.event + '.mp3',
            time: element.datetime,
            big_picture: base64Img.base64Sync(bigPath + element.big_picture),
            small_picture: base64Img.base64Sync(smallPath + element.small_picture)
          }
        }

      } else {

        let bigPath = rootPath + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/big_picture/'
        let smallPath = rootPath + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/small_picture/'
        
        if (element.event === '职工') {
            return {
              id: element.id,
              text: element.id + ' ' + location[element.channel_name] + element.event + ' ' + element.person_name + ' ' + element.cause,
              src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + element.event + element.cause + '.mp3',
              time: element.datetime,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture),
              small_picture: base64Img.base64Sync(smallPath + element.small_picture)
            }
        } else if (element.event === '外事员工'){
          return {
            id: element.id,
            text: element.id + ' ' + location[element.channel_name] + '外事人员' + areaRoad[element.cause],
            src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + '外事人员' + areaRoad[element.cause] + '.mp3',
            time: element.datetime,
            big_picture: base64Img.base64Sync(bigPath + element.big_picture),
            small_picture: base64Img.base64Sync(smallPath + element.small_picture)
          }
        } else if (element.event === '员工'){
          return {
            id: element.id,
            text: element.id + ' ' + location[element.channel_name] + '员工' + element.cause,
            src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + '员工' + element.cause + '.mp3',
            time: element.datetime,
            big_picture: base64Img.base64Sync(bigPath + element.big_picture),
            small_picture: base64Img.base64Sync(smallPath + element.small_picture)
          }
        } else {
            return {
              id: element.id,
              text: element.id + ' ' + location[element.channel_name] + element.event,
              src: 'http://192.168.2.254:8360/static/audio/' + location[element.channel_name] + element.event + '.mp3',
              time: element.datetime,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture),
              small_picture: base64Img.base64Sync(smallPath + element.small_picture)
            }
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