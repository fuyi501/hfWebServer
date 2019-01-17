'use strict';

import Base from './base.js';
var jwt = require('jsonwebtoken');
var http = require('http');
const userDB = [
{
    username: 'admin',
    password: 'admin',
    uuid: 'admin-uuid',
    name: '管理员'
},
{
    username: 'personnel',
    password: 'personnel',
    uuid: 'personnel-uuid',
    name: '人事部'
},
{
    username: 'security',
    password: 'security',
    uuid: 'security-uuid',
    name: '安环部'
}
]

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction() {

    return this.display();
  }
  setCorsHeader() {
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    this.header('Access-Control-Allow-Headers', 'Authorization,Content-Type,X-Requested-With');
    this.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,PUT,DELETE");
    this.header('Access-Control-Allow-Credentials', 'true');
  }
  // 登录
  async loginAction() {
    this.setCorsHeader()
    console.log('登录')
    if (this.isPost()) {
      let data = this.post()
      console.log(data)
      const user = userDB.find(e => e.username === data.username && e.password === data.password)
      if (user) {
        var token = jwt.sign({ data: data }, 'shhhhh', { expiresIn: '24h' });
        console.log('token:', token)
        var decoded = jwt.verify(token, 'shhhhh');
        console.log('解码数据：',decoded, decoded.data) // 
        this.success({
          code: 0,
          msg: '登录成功',
          data: {
              ...user,
              token: token
          }
        })
      } else {
        this.fail({
          code: 401,
          msg: '用户名或密码错误',
          data: {}
        })
      }
    } else {
      this.fail('请求方法不对')
    }
  }
  // 校验 token
  async verifytokenAction() {
    // this.setCorsHeader()
    console.log('校验token')
    let headerData = await this.header()
    console.log('headerDate:', headerData)
    // let token = headerData.authorization
    // console.log('token:', token)
    // let data = await this.get()
    // console.log(data)
    // if(token){
    //   // verify a token symmetric
    //   try {
    //     let decoded = jwt.verify(token, 'shhhhh');
    //     console.log('decoded:', decoded)
    //     this.success({
    //       code: 0,
    //       msg: 'token可用',
    //       data: {}
    //     })
    //   } catch (error) {
    //     console.log('错误：', error)
    //     this.fail({
    //       code: 401,
    //       msg: 'token过期',
    //       data: {}
    //     })
    //   }
    // }
  }
}