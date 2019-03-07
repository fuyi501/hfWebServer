'use strict';

import Base from './base.js';
const fse = require('fs-extra');
var dayjs = require('dayjs');
var base64Img = require('base64-img');

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
  "Area_A7_84": "水洗塔1",
  "intrusion_xf_123": "办公室消防楼梯",
  "intrusion_xf_125":"一车间消防楼梯",
  "intrusion_xf_141":"二车间消防楼梯1",
  "intrusion_xf_140":"二车间消防楼梯2",
  "intrusion_xf_142":"二车间消防楼梯3"
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
  "侵入R19": "侵入道路19"
}

const categoryType = {
  "all": "所有检测类型",
  "face": "人脸检测",
  "hat": "安全帽检测",
  "intrusion": "入侵检测",
  "area": "周界入侵检测",
  "road": "周界入侵检测"
}

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {

    this.assign("title", "异常事件查询")
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
    console.log("查询异常事件")
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log(data)
      let startTime = dayjs(data.eventInfo.startTime).format('YYYY-MM-DD HH:mm:ss')
      let endTime = dayjs(data.eventInfo.endTime).format('YYYY-MM-DD HH:mm:ss')
    //   let startTime = dayjs(data.eventInfo.startTime).format()
    //   let endTime = dayjs(data.eventInfo.endTime).format()
      // console.log(startTime, endTime)

      // 需要修改的路径
        // let rootPath = '/DATACENTER3/huifu/HuiFu_Project/image_cache/' // 15服务器
        let rootPath = '/DATACENTER1/huifu/image_cache/' // 汇富工厂

        let rootPath2 = '/huifu2/huifu/HuiFu_Project/image_cache/'
        var newRes = ''
        var res = ''
        
      if (data.eventInfo.event === 'all' && data.eventInfo.video === 'all') {
        res = await this.model("event_info").where({datetime: {'>':startTime, '<':endTime}, status: '异常'}).limit(20).select();
        // console.log('res:', res)
      } else if (data.eventInfo.event !== 'all' && data.eventInfo.video === 'all') {
        res = await this.model("event_info").where({category: data.eventInfo.event, datetime: {'>':startTime, '<':endTime}, status: '异常'}).limit(20).select();
        // console.log('res:', res)
      } else if (data.eventInfo.event === 'all' && data.eventInfo.video !== 'all') {
        res = await this.model("event_info").where({channel_name: data.eventInfo.video, datetime: {'>':startTime, '<':endTime}, status: '异常'}).limit(20).select();
        // console.log('res:', res)
      } else {
        res = await this.model("event_info").where({category: data.eventInfo.event, channel_name: data.eventInfo.video, datetime: {'>':startTime, '<':endTime}, status: '异常'}).limit(20).select();
      }

      var newRes = res.map((element, index) => {

        if(element.category === 'area' || element.category === 'road') {

          let bigPath = rootPath2 + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/big_picture/'
          
          if (element.event === '职工') {
            return {
              id: element.id,
              category: categoryType[element.category],
              channel_name: location[element.channel_name],
              datetime: dayjs(element.datetime).format('YYYY-MM-DD HH:mm:ss'),
              text: location[element.channel_name] + element.event + ' ' + element.person_name + ' ' + element.cause,
              status: element.status,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture)
            }
          } else if (element.event === '外事员工'){
            return {
              id: element.id,
              category: categoryType[element.category],
              channel_name: location[element.channel_name],
              datetime: dayjs(element.datetime).format('YYYY-MM-DD HH:mm:ss'),
              text: location[element.channel_name] + '外事人员' + areaRoad[element.cause],
              status: element.status,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture)
            }
          } else if (element.event === '员工'){
            return {
              id: element.id,
              category: categoryType[element.category],
              channel_name: location[element.channel_name],
              datetime: dayjs(element.datetime).format('YYYY-MM-DD HH:mm:ss'),
              text: location[element.channel_name] + '员工' + element.cause,
              status: element.status,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture)
            }
          } else {
            return {
              id: element.id,
              category: categoryType[element.category],
              channel_name: location[element.channel_name],
              datetime: dayjs(element.datetime).format('YYYY-MM-DD HH:mm:ss'),
              text: location[element.channel_name] + element.event,
              status: element.status,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture)
            }
          }
  
        } else {

          let bigPath = rootPath + element.category + '/' + element.channel_name + '/' + dayjs(element.datetime).format('YYYY-MM-DD') + '/big_picture/'
          
          if (element.event === '职工') {
              return {
                id: element.id,
                category: categoryType[element.category],
                channel_name: location[element.channel_name],
                datetime: dayjs(element.datetime).format('YYYY-MM-DD HH:mm:ss'),
                text: location[element.channel_name] + element.event + ' ' + element.person_name + ' ' + element.cause,
                status: element.status,
                big_picture: base64Img.base64Sync(bigPath + element.big_picture)
              }
          } else if (element.event === '外事员工'){
              return {
                id: element.id,
                category: categoryType[element.category],
                channel_name: location[element.channel_name],
                datetime: dayjs(element.datetime).format('YYYY-MM-DD HH:mm:ss'),
                text: location[element.channel_name] + '外事人员' + areaRoad[element.cause],
                status: element.status,
                big_picture: base64Img.base64Sync(bigPath + element.big_picture)
              }
          } else if (element.event === '员工'){
            return {
              id: element.id,
              category: categoryType[element.category],
              channel_name: location[element.channel_name],
              datetime: dayjs(element.datetime).format('YYYY-MM-DD HH:mm:ss'),
              text: location[element.channel_name] + '员工' + element.cause,
              status: element.status,
              big_picture: base64Img.base64Sync(bigPath + element.big_picture)
            }
          } else {
              return {
                id: element.id,
                category: categoryType[element.category],
                channel_name: location[element.channel_name],
                datetime: dayjs(element.datetime).format('YYYY-MM-DD HH:mm:ss'),
                text: location[element.channel_name] + element.event,
                status: element.status,
                big_picture: base64Img.base64Sync(bigPath + element.big_picture)
              }
          }
        }
      })
      this.success(newRes)

    } else {
      this.fail('请求方法不对')
    }
  }
}