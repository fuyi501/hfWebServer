'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
  type: 'mysql',
  adapter: {
    mysql: {
      // host: 'localhost',
      // host: '192.168.100.240',
      host: '192.168.100.240',
      port: '3306',
      database: 'test',
      user: 'root',
      password: '123456',
      prefix: '',
      encoding: 'utf8'
    },
    mongo: {

    }
  }
};