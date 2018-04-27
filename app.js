'use script'

var Koa = require('koa')
var path = require('path')
var util = require('./libs/util')
var wechat = require('./wechat/g')
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

var app = new Koa();
app.use(wechat(config.wechat))

app.listen(1234)
console.log('Listening 1234')