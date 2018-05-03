var util = require('./libs/util')
var path = require('path')
var wechat_file = path.join(__dirname, './config/wechat.txt')


var config = {
    wechat: {
        appID: 'wxc414d249679b6001',
        appSecret: '123c2d4e55d5b8c426f2ca30d0f5f909',
        token: 'mc_platform',
        getAccessToken: function () {
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken: function (data) {
            data = JSON.stringify(data)
            return util.writeFileAsync(wechat_file,data)
        }
    }
}

exports = module.exports = config;