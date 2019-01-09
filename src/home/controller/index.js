'use strict';

import Base from './base.js';

const fs = require('fs');
const fse = require('fs-extra');
const exec = require('child_process').exec;
const jwt = require('jsonwebtoken');

export default class extends Base {

  /**
   * 前置方法
   * @return {Promise} []
   */
  __before(){
    console.log('前置操作')
    console.log('校验token')
    let headerData = this.header()
    console.log('headerDate:', headerData)
    let token = headerData.authorization
    console.log('token:', token)
    if(token){
      // verify a token symmetric
      try {
        let decoded = jwt.verify(token, 'shhhhh');
        console.log('decoded:', decoded)
      } catch (error) {
        console.log('错误：', error)
        this.fail({
          code: 10010,
          msg: 'token过期',
          data: {}
        })
      }
    }
  }

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
  // 保存表格
  async savetableAction() {
    console.log("保存表格")
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log("data:", data)
      if (!think.isEmpty(data.tableInfo)) {
        if (data.tableType === 'staff') {
          try {
            for (let i in data.tableInfo) {
              let res = await this.model("staff_info").add(data.tableInfo[i])
              console.log('res:', res)
            }
            // let res = await this.model("staff_info").addMany(data.tableInfo)
            return this.jsonp({
              code: 2000,
              desc: "添加成功"
            })
          } catch (error) {
            console.log(error)
            return this.jsonp({
              code: 2002,
              desc: error
            })
          }
        } else if (data.tableType === 'schedule') {
          try {
            for (let i in data.tableInfo) {
              let res = await this.model("testschedule").add(data.tableInfo[i])
              console.log('res:', res)
            }
            return this.jsonp({
              code: 2000,
              desc: "添加成功"
            })
          } catch (error) {
            console.log(error)
            return this.jsonp({
              code: 2002,
              desc: error
            })
          }

        } else {
          return this.jsonp({
            code: 2001,
            desc: "添加字段不对"
          })
        }
      }
    } else {
      this.fail('请求的方法不对')
    }
  }
  // 获取表格数据
  async gettableAction() {
    this.setCorsHeader()
    var data = this.get()
    console.log('获取到的数据：', data)
    if (data.type === 'sche') {
      data = await this.model('testschedule').select();
      // console.log("查询到的数据：", data)
      return this.success(data);
    } else if (data.type === 'staff') {
      data = await this.model('staff_info').select();
      // console.log("查询到的数据：", data)
      return this.success(data);
    }
  }
  //删除表格数据
  async deletetableAction() {
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log(data)
      if (data.type === 'sche') {
        let res = await this.model("testschedule").where({
          t_id: data.tableData.t_id
        }).delete(data.tableData);
        console.log('删除成功:', res)
        console.log('更新成功')
        this.success({
          code: 2000,
          desc: "更新成功"
        })
      } else if (data.type === 'staff') {
        let res = await this.model("staff_info").where({
          staff_id: data.tableData.staff_id
        }).delete(data.tableData);
        console.log('删除成功:', res)
        console.log('删除成功')

        if(data.tableData.photo_name !== ''){
          console.log('删除人脸照片')
          // 第一张保存的路径
          let save1path = '/DATACENTER3/huifu/HuiFu_Project/staff_photo/' + data.tableData.staff_id + '_' + data.tableData.name + '.jpg'
          // 另外五张保存的路径
          let save2path = '/DATACENTER3/huifu/HuiFu_Project/update_face_lib/staff_face_ysd/' + data.tableData.staff_id + '/'
          fse.remove(save1path, err => {
            if (err) return console.error(err)
          
            console.log('删除第一张成功!')
          })
          fse.remove(save2path, err => {
            if (err) return console.error(err)
          
            console.log('删除另外五张成功!')
          })
        }
        this.success({
          code: 2000,
          desc: "删除成功"
        })
      } else {
        this.fail('请求参数不对')
      }
    } else {
      this.fail('请求方法不对')
    }
  }
  //编辑表格信息
  async edittableAction() {
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log(data)
      if (data.type === 'sche') {
        let res = await this.model("testschedule").where({
          t_id: data.tableData.t_id
        }).update(data.tableData);
        console.log('res:', res)
        console.log('更新成功')
        this.success({
          code: 2000,
          desc: "更新成功"
        })
      } else if (data.type === 'staff') {
        let res = await this.model("staff_info").where({
          staff_id: data.tableData.staff_id
        }).update(data.tableData);
        console.log('res:', res)
        console.log('更新成功')
        this.success({
          code: 2000,
          desc: "更新成功"
        })
      } else {
        this.fail('请求参数不对')
      }
    } else {
      this.fail('请求方法不对')
    }
  }
  //添加表格信息
  async addtableAction() {
    this.setCorsHeader()
    if (this.isPost()) {
      let data = this.post()
      console.log(data)
      if (data.type === 'sche') {
        let res = await this.model("testschedule").add(data.tableData);
        console.log('res:', res)
        console.log('更新成功')
        this.success({
          code: 2000,
          desc: "更新成功"
        })
      } else if (data.type === 'staff') {
        let res = await this.model("staff_info").add(data.tableData);
        console.log('res:', res)
        console.log('更新成功')
        this.success({
          code: 2000,
          desc: "更新成功"
        })
      } else {
        this.fail('请求参数不对')
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
      console.log('人脸', data)
      // if (data.faceIds.length > 0) {

        let filename = '/DATACENTER3/huifu/HuiFu_Project/update_face_lib/update_face_lib.py'
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
      // } else {
      //   this.success({
      //     code: 2001,
      //     desc: "没有需要更新的"
      //   })
      // }
    } else {
      this.fail('请求方法不对')
    }
  }
  // 保存拍摄的图片
  async imgAction() {
    console.log("保存拍摄的图片")
    this.setCorsHeader()
    if (this.isPost()) {
      let imgInfo = this.post()
      console.log("imgInfo:",imgInfo)
      imgInfo = imgInfo.imgInfo
      if (!think.isEmpty(imgInfo.name)) {

        //接收前台POST过来的base64
        var imgData = imgInfo.url
        //过滤data:URL
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "")
        var dataBuffer = new Buffer(base64Data, 'base64')
        // let savepath = '/DATACENTER3/huifu/HuiFu_Project/staff_photo/' + imgInfo.name
        let savepath = think.RESOURCE_PATH + '/upload/faceimg/' + imgInfo.name

        let faceInfo = imgInfo.name.split('_')
        let faceCount = faceInfo[2].split('.')
        console.log(faceInfo, faceCount)

        // 第一张保存的路径
        let savepath1 = '/DATACENTER3/huifu/HuiFu_Project/staff_photo/' + faceInfo[0] + '_' + faceInfo[1] + '.jpg'
        // 第二张保存的路径
        let savepath2 = '/DATACENTER3/huifu/HuiFu_Project/update_face_lib/staff_face_ysd/' + faceInfo[0]

        // 第一张保存
        if (faceCount[0] === '1') {
          fs.exists(savepath1, (isexist) => {
            console.log("isexist", isexist)
            if (!isexist) {
              fs.writeFile(savepath1, dataBuffer, (err) => {
                console.log("不存在，准备保存")
                if (err === null) {
                  console.log(imgInfo.name + " 保存成功")
                  return this.jsonp({
                    code: 2000,
                    desc: imgInfo.name + " 添加成功"
                  })
                } else {
                  console.log(imgInfo.name + " 保存失败", err)
                  return this.jsonp({
                    code: 2002,
                    desc: imgInfo.name + " 添加失败"
                  })
                }
              })
            } else {
              console.log(imgInfo.name + " 文件已存在")
              return this.jsonp({
                code: 2001,
                desc: imgInfo.name + " 文件已存在"
              })
            }
          })
        }

        // 其他的保存
        fs.exists(savepath2, (isexist) => {
          let savafacepath = savepath2 + '/' + (Number(faceCount[0]) - 1) + '.jpg'
          if (!isexist) {
            console.log("不存在，创建目录")
            fs.mkdir(savepath2, (err) => {
              if (!err) {
                console.log('创建成功')
                fs.chmod(savepath2, '0777', (err) => {
                  if (err) {
                    console.log("修改失败")
                  } else {
                    console.log("修改权限成功")
                    fs.exists(savafacepath, (isexist) => {
                      console.log("isexist", isexist)
                      if (!isexist) {
                        fs.writeFile(savafacepath, dataBuffer, (err) => {
                          if (!err) {
                            console.log(imgInfo.name + " 保存成功")
                            return this.jsonp({
                              code: 2000,
                              desc: imgInfo.name + " 添加成功"
                            })
                          } else {
                            console.log(imgInfo.name + " 保存失败", err)
                            return this.jsonp({
                              code: 2002,
                              desc: imgInfo.name + " 添加失败"
                            })
                          }
                        })
                      } else {
                        console.log(imgInfo.name + " 文件已存在")
                        return this.jsonp({
                          code: 2001,
                          desc: imgInfo.name + " 文件已存在"
                        })
                      }
                    })
                  }
                })
              } else {
                return this.jsonp({
                  code: 2005,
                  desc: '创建目录错误：' + err
                })
              }
            })
          } else {
            console.log("路径存在", savafacepath)
            fs.exists(savafacepath, (isexist) => {
              console.log("isexist", isexist)
              if (!isexist) {
                fs.writeFile(savafacepath, dataBuffer, (err) => {
                  if (!err) {
                    console.log(imgInfo.name + " 保存成功")
                    return this.jsonp({
                      code: 2000,
                      desc: imgInfo.name + " 添加成功"
                    })
                  } else {
                    console.log(imgInfo.name + " 保存失败", err)
                    return this.jsonp({
                      code: 2002,
                      desc: imgInfo.name + " 添加失败"
                    })
                  }
                })
              } else {
                console.log(imgInfo.name + " 文件已存在")
                return this.jsonp({
                  code: 2001,
                  desc: imgInfo.name + " 文件已存在"
                })
              }
            })
          }
        })
      }
    } else {
      this.fail('请求方法不对')
    }
  }

  // 保存拍摄的图片
  async imgallAction() {
    console.log("保存拍摄的图片")
    this.setCorsHeader()
    if (this.isPost()) {
      let imgInfo = this.post()
      // console.log("imgInfo:",imgInfo)
      imgInfo = imgInfo.imgInfo
      if (!think.isEmpty(imgInfo)) {

        let iii = []
        for(let j in imgInfo){
          iii.push(imgInfo[j].url)
          console.log(j)
        }


        var nary = iii.sort()
        for(var i=0;i<iii.length;i++){
          if (nary[i] === nary[i+1]){
            console.log("数组重复内容："+nary[i]);
          }
          console.log('没有重复的')
        }
        let imgData = ''
        let base64Data = ''
        let dataBuffer = ''

        for(let i in imgInfo) {
          console.log('这是', i)
          //接收前台POST过来的base64
          imgData = imgInfo[i].url
          //过滤data:URL
          base64Data = imgData.replace(/^data:image\/\w+;base64,/, "")
          dataBuffer = new Buffer(base64Data, 'base64')

          let faceInfo = imgInfo[i].name.split('_')
          let faceCount = faceInfo[2].split('.')
          // console.log(faceInfo, faceCount)

          let savepath1 = '/DATACENTER3/huifu/HuiFu_Project/staff_photo/' + faceInfo[0] + '_' + faceInfo[1] + '.jpg'
          let savepath2 = '/DATACENTER3/huifu/HuiFu_Project/update_face_lib/staff_face_ysd/' + faceInfo[0]

          // 第一张保存
          if (faceCount[0] === '1') {
            fs.exists(savepath1, (isexist) => {
              console.log("isexist", isexist)
              if (!isexist) {
                fs.writeFile(savepath1, dataBuffer, (err) => {
                  console.log("不存在，准备保存")
                  if (err === null) {
                    console.log(imgInfo[i].name + " 保存成功")
                  } else {
                    console.log(imgInfo[i].name + " 保存失败", err)
                  }
                })
              } else {
                console.log(imgInfo[i].name + " 文件已存在")
              }
            })
          }

          // 其他的保存
          fs.exists(savepath2, (isexist) => {
            let savafacepath = savepath2 + '/' + (Number(faceCount[0]) - 1) + '.jpg'
            console.log('savepath2', savepath2)
            if (!isexist) {
              console.log("不存在，创建目录")
              fs.mkdir(savepath2, (err) => {
                if (!err) {
                  console.log('创建成功')
                  fs.chmod(savepath2, '0777', (err) => {
                    if (err) {
                      console.log("修改失败")
                    } else {
                      console.log("修改权限成功")
                      fs.exists(savafacepath, (isexist) => {
                        console.log("isexist", isexist)
                        if (!isexist) {
                          fs.writeFile(savafacepath, dataBuffer, (err) => {
                            if (!err) {
                              console.log(imgInfo[i].name + " 保存成功")
                            } else {
                              console.log(imgInfo[i].name + " 保存失败", err)
                            }
                          })
                        } else {
                          console.log(imgInfo[i].name + " 文件已存在")
                        }
                      })
                    }
                  })
                } else {
                  fs.exists(savafacepath, (isexist) => {
                    console.log("isexist", isexist)
                    if (!isexist) {
                      fs.writeFile(savafacepath, dataBuffer, (err) => {
                        if (!err) {
                          console.log(imgInfo[i].name + " 保存成功")
                        } else {
                          console.log(imgInfo[i].name + " 保存失败", err)
                        }
                      })
                    } else {
                      console.log(imgInfo[i].name + " 文件已存在")
                    }
                  })
                }
              })
            } else {
              console.log("路径存在", savafacepath)
              fs.exists(savafacepath, (isexist) => {
                console.log("isexist", isexist)
                if (!isexist) {
                  fs.writeFile(savafacepath, dataBuffer, (err) => {
                    if (!err) {
                      console.log(imgInfo[i].name + " 保存成功")
                    } else {
                      console.log(imgInfo[i].name + " 保存失败", err)
                    }
                  })
                } else {
                  console.log(imgInfo[i].name + " 文件已存在")
                  
                }
              })
            }
          })

        }

        let filename = '/DATACENTER3/huifu/HuiFu_Project/update_face_lib/update_face_lib.py'
        let dirName = imgInfo[0].name.split('_')[0]
        exec('python ' + filename + ' --pic_path=/DATACENTER3/huifu/HuiFu_Project/update_face_lib/staff_face_ysd/' + dirName, (err, stdout, stdin) => {
          console.log('裁剪人脸库')

          if (err) {
            console.log('err错误', err)
          }
          if (stdout) {
            // parse the string
            console.log('stdout:', stdout.replace(/[\r\n]/g, ""))
            stdout = stdout.replace(/[\r\n]/g, "")
            if(stdout === 'crop_face_succeed'){
              console.log('上传且裁剪成功')
              this.success({
                code: 2000,
                desc: "上传且裁剪成功"
              })
            }else{
              console.log('上传且裁剪失败')
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

  //保存上传的图片
  async saveimgAction() {
    this.setCorsHeader()
    if (this.isPost()) {
      let userInfo = this.post()
      console.log("userInfo:", userInfo)
      let userAvatar = this.file('avatar')
      console.log(userAvatar)
      if (userAvatar.originalFilename) {
        fs.readFile(userAvatar.path, (err, data) => {

          // var imgType = userAvatar.originalFilename.split('.')[1]
          // var newName = userInfo.uid  + '.' + imgType
          var savePath = think.RESOURCE_PATH + '/upload/avatar/' + userAvatar.originalFilename
          fs.exists(savePath, (isexist) => {
            console.log("是否已存在：", isexist)
            if (!isexist) {
              fs.writeFile(savePath, data, (err) => {
                console.log("不存在，准备保存")
                if (err === null) {
                  console.log("保存成功")
                  return this.jsonp({
                    code: 2000,
                    desc: "添加成功"
                  })
                } else {
                  console.log("保存失败")
                  return this.jsonp({
                    code: 2000,
                    desc: err
                  })
                }

              })
            } else {
              console.log("文件已存在")
              return this.jsonp({
                code: 2001,
                desc: "文件已存在"
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
}