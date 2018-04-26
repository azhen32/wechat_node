'use script'
var Koa = require('koa')
var wechat = require('./wechat/g')
var config = {
    wechat: {
        appID: 'wxc414d249679b6001',
        appSecret: 'XHvMAfUx2AIQvfUtbLwNZRtis57DXTcZAMBxQ8ICxr8',
        token: 'mc_platform'
    }
}

var app = new Koa();
app.use(wechat(config.wechat))

app.listen(1234)
console.log('Listening 1234')