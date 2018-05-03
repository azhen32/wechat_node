'use script'

var Koa = require('koa')
var config = require('./config');
var wechat = require('./wechat/g')
var weixin = require('./weixin')
var app = new Koa();
app.use(wechat(config.wechat,weixin.reply))

app.listen(1234)
console.log('Listening 1234')