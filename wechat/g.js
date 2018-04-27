'use script'
var sha1 = require('sha1');
var Promise = require('bluebird');
var getRawBody = require('raw-body')
var Wechat = require('./wechat')
var util = require('./util')


module.exports = function(opts) {
    var wechat = new Wechat(opts);
    return function *(next) {
        var token = opts.token;
        var signature = this.query.signature;
        var nonce = this.query.nonce;
        var timestamp = this.query.timestamp;
        var echostr = this.query.echostr;
        var str = [token, timestamp, nonce].sort().join('')
        var sha = sha1(str);
        var that = this;

        if (this.method === 'GET') {
            if (sha === signature) {
                this.body = echostr + ''
            } else {
                this.body = 'wrong';
            }
        } else if (this.method === 'POST') {
            if (sha !== signature) {
                this.body = 'wrong';
                return false;
            }

            // 获取原始Xml数据
            var data = yield getRawBody(this.req, {
                length: this.length,
                limit: '1mb',
                encoding: this.charset
            })

            var content = yield util.parseXMLAsync(data);
            var message = util.formatMessage(content.xml)
            console.log(message)

            if (message.MsgType === 'text') {
               /* if (message.Event === 'subscribe') {
                    var now = new Date().getTime();
                    that.status = 200;
                    that.type = 'application/xml'
                    that.body = '<xml>' +
                        '<ToUserName>< ![CDATA['+ message.FromUserName +']]></ToUserName>' +
                        '<FromUserName>< ![CDATA['+ message.ToUserName +']]></FromUserName>' +
                        '<CreateTime>' + now + '</CreateTime>' +
                        '<MsgType>< ![CDATA[text] ]></MsgType>' +
                        '<Content>< ![CDATA[这里有很多有村架纯的东西] ]></Content>' +
                        '</xml>'
                    return ;
                }*/
                var now = new Date().getTime();
                that.status = 200;
                that.type = 'application/xml'
                that.body = '<xml>' +
                    '<ToUserName><![CDATA['+ message.FromUserName +']]></ToUserName>' +
                    '<FromUserName><![CDATA['+ message.ToUserName +']]></FromUserName>' +
                    '<CreateTime>' + now + '</CreateTime>' +
                    '<MsgType><![CDATA[text]]></MsgType>' +
                    '<Content><![CDATA[这里有很多有村架纯的东西]]></Content>' +
                    '</xml>'

                console.log(this.body)
            }
        }
    }
};
