'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
  type: 'mysql',
  adapter: {
    mysql: {
      host: 'localhost',
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