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
      var searchTime = data.eventTime.split(',')
      var newRes = []
      if (data.eventType === 'all') {

        let res1 = await this.model("event_info").query(
          `SELECT DATE_FORMAT(datetime, '%Y-%m-%d %H') eventTime, COUNT(status) eventCount 
          FROM event_info 
          WHERE status='正常' AND datetime BETWEEN '2019-03-03 06:00:00' AND '2019-03-03 22:00:00' 
          GROUP BY eventTime`)
        let res2 = await this.model("event_info").query(
          `SELECT DATE_FORMAT(datetime, '%Y-%m-%d %H') eventTime, COUNT(status) eventCount 
          FROM event_info 
          WHERE status='异常' AND datetime BETWEEN '2019-03-03 06:00:00' AND '2019-03-03 22:00:00' 
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
          this.success([
            { '日期': '06:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '07:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '08:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '09:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '10:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '11:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '12:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '13:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '14:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '15:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '16:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '17:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            // { '日期': '18:00', '异常事件': '', '正常事件': '', '异常率': '' },
            // { '日期': '19:00', '异常事件': '', '正常事件': '', '异常率': '' },
            // { '日期': '20:00', '异常事件': '', '正常事件': '', '异常率': '' },
            // { '日期': '21:00', '异常事件': '', '正常事件': '', '异常率': '' },
            // { '日期': '22:00', '异常事件': '', '正常事件': '', '异常率': '' },
          ])
        }
      } else {
        let res1 = await this.model("event_info").query(
          `SELECT DATE_FORMAT(datetime, '%Y-%m-%d %H') eventTime, COUNT(status) eventCount 
          FROM event_info 
          WHERE category='${data.eventType}' AND status='正常' AND datetime BETWEEN '2019-03-03 06:00:00' AND '2019-03-03 22:00:00' 
          GROUP BY eventTime`)
        let res2 = await this.model("event_info").query(
          `SELECT DATE_FORMAT(datetime, '%Y-%m-%d %H') eventTime, COUNT(status) eventCount 
          FROM event_info 
          WHERE category='${data.eventType}' AND status='异常' AND datetime BETWEEN '2019-03-03 06:00:00' AND '2019-03-03 22:00:00' 
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
          this.success([
            { '日期': '06:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '07:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '08:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '09:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '10:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '11:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '12:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '13:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '14:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '15:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '16:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            { '日期': '17:00', '异常事件': 0, '正常事件': 0, '异常率': 0 },
            // { '日期': '18:00', '异常事件': '', '正常事件': '', '异常率': '' },
            // { '日期': '19:00', '异常事件': '', '正常事件': '', '异常率': '' },
            // { '日期': '20:00', '异常事件': '', '正常事件': '', '异常率': '' },
            // { '日期': '21:00', '异常事件': '', '正常事件': '', '异常率': '' },
            // { '日期': '22:00', '异常事件': '', '正常事件': '', '异常率': '' },
          ])
        }
      }
    } else {
      this.fail('请求方法不对')
    }
  }
}