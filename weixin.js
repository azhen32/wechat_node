'use strict'
var config = require('./config')
var Wechat = require('./wechat/wechat')
var wechatApi = new Wechat(config.wechat)

exports.reply = function* (next) {
    var message = this.weixin;
    // 事件推送消息类型
    if (message.MsgType === 'event') {
        // 订阅消息
        if (message.Event === 'subscribe') {
            // 搜索公众号或扫描二维码
            if (message.EventKey) {
                // TODO
                console.log('扫描二维码进来: ' + message.EventKey + ' ' + message.ticket);
            }
            this.body = '你好，欢迎关注架纯的应援号';
        } else if (message.Event === 'unsubscribe') {
            // 取消订阅
            console.log('无情取关');
            this.body = ''
        } else if (message.Event === 'LOCATION'){
            // 上报地理位置时间
            this.body = '您上报的位置是: ' + message.Latitude + '/' +
                message.Longitude + '-' + message.Precision;
        } else if (message.Event = 'CLICK') {
            // 点击时间
            this.body = '您点击了菜单: ' + messaage.EventKey;
        } else if (message.Event === 'SCAN') {
            // 扫描事件
            console.log('关注后扫描二维码' + message.EventKey + ' ' +
                message.Ticket);
            this.body = '看到你扫了了一下';
        } else if (message.Event === 'VIEW') {
            this.body = '您点击了菜单中的链接: ' + message.EventKey;
        }
    } else if (message.MsgType === 'text') {
        let content = message.Content;
        let reply = '额，你说的 ' + message.Content + '太复杂了';

        if (content === '1') {
            reply = '架纯的图片';
        } else if (content === '2') {
            reply = '架纯的简介';
        } else if (content === '3') {
            reply = '架纯的消息';
        } else if (content === '4') {
            reply=[
                {
                    title: '拥抱变化',
                    description: '只有变化是永恒的',
                    picUrl:'https://www.baidu.com/s?wd=%E4%BB%8A%E6%97%A5%E6%96%B0%E9%B2%9C%E4%BA%8B&tn=SE_Pclogo_6ysd4c7a&sa=ire_dl_gh_logo&rsv_dl=igh_logo_pc',
                    url:'http://www.baidu.com'
                },
                {
                    title: '拥抱开源',
                    description: '开源帮助技术发展',
                    picUrl:'https://www.baidu.com/s?wd=%E4%BB%8A%E6%97%A5%E6%96%B0%E9%B2%9C%E4%BA%8B&tn=SE_Pclogo_6ysd4c7a&sa=ire_dl_gh_logo&rsv_dl=igh_logo_pc',
                    url:'http://www.jd.com'
                }
            ]
        } else if (content === '5') {
            var data = yield wechatApi.uploadMaterial('image', __dirname + '/2.jpg');
            reply = {
                type: 'image',
                mediaId: data.media_id
            }
            console.log(reply);
        } else 
        this.body = reply;
    }

    yield next;
}