'use strict';
/**
 * config
 */

  //key: value
  // import fs from 'fs';
  // import https from 'https';
  // const options = {
  //   key: fs.readFileSync('./ssl/server.key'),
  //   cert: fs.readFileSync('./ssl/server.crt')
  // };
  // const app = (callback, port, host, think) => {
  //   let server = https.createServer(options, callback);
  //   server.listen(port, host);
  //   // console.log('server', server)
  //   return server;
  // }
  export default {
    // port: 9000, //服务监听的端口
    // create_server: app,
    resource_on: true, //是否开启静态资源解析功能
    resource_reg: /^(static\/|[^\/]+\.(?!js|html)\w+$)/, //判断为静态资源请求的正则
  };
