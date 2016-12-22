/**
 * Created by ybao on 16/9/16.
 */

var config = {
    //app name
    name:'nforum',
    //是否开启 debug
    debug: true,
    //mysql 配置
    mysql: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        database: 'nforum',
        port: 3306
    },

    //返回状态码
    status_code: {
        STATUS_OK: 0,
        STATUS_DATA_NOT_FOUND: 1,
        STATUS_SERVER_ERROR: 2,
        STATUS_INVAILD_PARAMS: 3,
        STATUS_DB_ERROR: 4
    },

    port: 5656,

    //url地址
    localUrl: "localhost:5656",

    remoteUrl: '182.254.247.206:5656'

}

module.exports = config;
// exports.config = config;

console.log(config.localUrl);