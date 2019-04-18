'use strict';

import Base from './base.js';
import dayjs from 'dayjs';
import { maxHeaderSize } from 'http';
const fse = require('fs-extra');

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {

    this.assign("title", "报表数据")
    return this.display();
  }
  setCorsHeader() {
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    this.header('Access-Control-Allow-Headers', 'Authorization,Content-Type,X-Requested-With');
    this.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
    this.header('Access-Control-Allow-Credentials', 'true');
  }
  // 查询报表数据
  async eventtypeAction() {
    console.log("查询报表数据")
    this.setCorsHeader()
    if (this.isGet()) {
      let data = this.get()
      console.log(data)
      var searchDate = dayjs(data.eventTime).format('YYYY-MM-DD')
      var newRes = []
      if (data.eventType === 'all') {

        let res1 = await this.model("event_info").query(
          `SELECT DATE_FORMAT(datetime, '%Y-%m-%d %H') eventTime, COUNT(status) eventCount 
          FROM event_info 
          WHERE status='正常' AND datetime like '${searchDate}%'
          GROUP BY eventTime`)
        let res2 = await this.model("event_info").query(
          `SELECT DATE_FORMAT(datetime, '%Y-%m-%d %H') eventTime, COUNT(status) eventCount 
          FROM event_info 
          WHERE status='异常' AND datetime like '${searchDate}%' 
          GROUP BY eventTime`)

        console.table(res1)
        console.table(res2)
        
        for(let i = 0; i < Math.max(res1.length, res2.length); i++ ) {
          console.log(res2[i].eventTime.split(' ')[1] + ':00', res1[i] ? res1[i].eventCount : '', res2[i] ? res2[i].eventCount : '')
          let time = res2[i].eventTime.split(' ')[1] + ':00'
          let normal = res1[i] ? res1[i].eventCount : 0
          let abnormal = res2[i] ? res2[i].eventCount : 0
          let ratio = normal&&abnormal ? abnormal/(normal+abnormal) : normal ? 0 : 1
          newRes.push({
            '日期': time,
            '正常事件': normal,
            '异常事件': abnormal,
            '异常率': ratio
          })
        }
        if (newRes.length > 0) {
          this.success(newRes)
        } else {
          this.success([])
        }
      } else {
        let res1 = await this.model("event_info").query(
          `SELECT DATE_FORMAT(datetime, '%Y-%m-%d %H') eventTime, COUNT(status) eventCount 
          FROM event_info 
          WHERE category='${data.eventType}' AND status='正常' AND datetime like '${searchDate}%'
          GROUP BY eventTime`)
        let res2 = await this.model("event_info").query(
          `SELECT DATE_FORMAT(datetime, '%Y-%m-%d %H') eventTime, COUNT(status) eventCount 
          FROM event_info 
          WHERE category='${data.eventType}' AND status='异常' AND datetime like '${searchDate}%'
          GROUP BY eventTime`)

        console.table(res1)
        console.table(res2)

        for(let i = 0; i < Math.max(res1.length, res2.length); i++ ) {
          console.log(res2[i].eventTime.split(' ')[1] + ':00', res1[i] ? res1[i].eventCount : '', res2[i] ? res2[i].eventCount : '')
          let time = res2[i].eventTime.split(' ')[1] + ':00'
          let normal = res1[i] ? res1[i].eventCount : 0
          let abnormal = res2[i] ? res2[i].eventCount : 0
          let ratio = normal&&abnormal ? abnormal/(normal+abnormal) : normal ? 0 : 1
          newRes.push({
            '日期': time,
            '正常事件': normal,
            '异常事件': abnormal,
            '异常率': ratio
          })
        }
        if (newRes.length > 0) {
          this.success(newRes)
        } else {
          this.success([])
        }
      }
    } else {
      this.fail('请求方法不对')
    }
  }

  // 获取首页主要数据
  async maininfoAction() {
    console.log("获取首页主要数据")
    this.setCorsHeader()
    if (this.isGet()) {
      let data = this.get()
      console.log(data)
      
        let allEvent = await this.model("event_info").where({datetime: ['like', dayjs().format('YYYY-MM-DD') + '%']}).count();
        let ycEvent = await this.model("event_info").where({status: '异常', datetime: ['like', dayjs().format('YYYY-MM-DD') + '%']}).count();
        let zcEvent = await this.model("event_info").where({status: '正常', datetime: ['like', dayjs().format('YYYY-MM-DD') + '%']}).count();
        let allPerson = await this.model("staff_info").count();
        let newPerson = await this.model("staff_record").where({record_time: ['like', dayjs().format('YYYY-MM-DD') + '%']}).count();
        console.log('res:', allEvent, ycEvent, zcEvent, allPerson, newPerson)
        this.success({
          allEvent: allEvent, // 总事件
          ycEvent: ycEvent, // 异常事件
          zcEvent: zcEvent, // 正常事件
          allPerson: allPerson, // 总人数
          newPerson: newPerson // 新增人数
        })
      
    } else {
      this.fail('请求方法不对')
    }
  }
}