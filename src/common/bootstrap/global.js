// /**
//  * this file will be loaded before server started
//  * you can define global functions used in controllers, models, templates
//  */

// /**
//  * use global.xxx to define global functions
//  * 
//  * global.fn1 = function(){
//  *     
//  * }
//  */

// import crontab from 'node-crontab';
// let AipSpeech = require("baidu-aip-sdk").speech;
// let fs = require('fs');
// var dayjs = require('dayjs')

// // 替换百度云控制台中新建百度语音应用的 APPID 、Api Key 和 Secret Key
// let client = new AipSpeech('15194283', 'nrrYN3OBLNpnRVi3Z6K2B9MH', 'lE5SlgBx3wdLce92obr7nm0EBUjBjCTL');

// // 获取数据
// let playaudio = async () => {

//     console.log("语音测试")
//     let data = await this.model('event_info').where({status: '异常', channel_name: ['IN', 'Gate,Lab']}).limit(1).select();
//     // console.log("data:", data)
//     let newdata = data.map((element, index) => {

//         if (element.event === '职工') {
//             return {
//                 text: location[element.channel_name] + element.event + element.cause,
//                 time: dayjs(element.datetime).format('YYYY-MM-DD HH:mm:ss')
//             }
//         } else {
//             return {
//                 text: location[element.channel_name] + element.event,
//                 time: dayjs(element.datetime).format('YYYY-MM-DD HH:mm:ss')
//             }
//         }
       
//     })
//     console.log(newdata)

//     let audioUrl = []

//     newdata.forEach(element => {
//         console.log("ele:", element)
        
//         console.log(think.RESOURCE_PATH + '/static/audio/' + element.text + element.time + '.mp3');
//         audioUrl.push(think.RESOURCE_PATH + '/static/audio/' + element.text + element.time + '.mp3')

//         // setTimeout(()=>{
//             // 语音合成，保存到本地文件
//             client.text2audio(element.text, {spd: 5, per: 4}).then(function(result) {
//                 if (result.data) {
//                     console.log('进来了', element.text)
//                     fs.writeFileSync(think.RESOURCE_PATH + '/static/audio/' + element.text + '.mp3', result.data);

//                 } else {
//                     // 合成服务发生错误
//                     console.log('语音合成失败: ' + JSON.stringify(result));
//                 }
//             }, function(err) {
//                 console.log(err);
//             });
//         // }, 500)
//     });

//     console.log(audioUrl)
  
//   }

// // 1秒钟执行一次
// let jobId = crontab.scheduleJob('*/4 * * * * *', playaudio);
