'use script'

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var util = require('./util')
var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var fs = require('fs')
var api = {
    accessToken: prefix + 'token?grant_type=client_credential',
    upload: prefix + 'media/upload?'
};
function Wechat(opts) {
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.fetchAccessToken();
}

Wechat.prototype.fetchAccessToken = function () {
    var that = this;
    if (this.access_token && this.expires_in) {
        if (this.isValidAccessToken(this)) {
            return Promise.resolve(this);
        } else {
            return
        }
    }
    this.getAccessToken()
        .then(function (data) {
            try {
                data = JSON.parse(data)
            } catch (e) {
                return that.updateAccessToken(data);
            }

            if (that.isValidAccessToken(data)) {
                return  Promise.resolve(data)
            } else {
                return that.updateAccessToken();
            }
        })
        .then(function (data) {
            that.access_token = data.access_token;
            that.expires_in = data.expires_in;

            that.saveAccessToken(data);
            return Promise.resolve(data);
        });
};

Wechat.prototype.isValidAccessToken = function (data) {
    if (!data || !data.access_token || !data.expires_in) {
        return false;
    }
    let access_token = data.access_token;
    let expires_in = data.expires_in;
    let now = (new Date().getTime());

    return now < expires_in;
};

Wechat.prototype.updateAccessToken = function () {
    let appID = this.appID;
    let appSecret = this.appSecret;
    let url = api.accessToken + '&appid=' + appID + "&secret=" + appSecret;

    return new Promise(function (resolve, reject) {
        console.log(url);
        request({url: url, json: true}).then(function (response) {
            console.log(response.body);
            let data = response.body;
            let now = (new Date().getTime());
            let expires_in = now + (data.expires_in - 20) * 1000;
            data.expires_in = expires_in;
            resolve(data);
        });
    });
};

Wechat.prototype.uploadMaterial = function (type, filePath) {
    var that = this;
    var form = {
        media: fs.createReadStream(filePath)
    }

    return new Promise(function (resolve, reject) {
       that.fetchAccessToken()
           .then(function(data) {
               var url = api.upload + '&access_token=' + data.access_token +
                       '&type=' + type;
               request({method:'POST',url: url, formData: form, json: true}).then(function (response) {
                   console.log(response.body);
                   let data = response.body;
                   if (data) {
                       resolve(data);
                   } else {
                       throw new Error('Upload material fails');
                   }
               }).catch(function (err) {
                   reject(err);
               });
           });
    });
};

Wechat.prototype.reply = function () {
    let content = this.body;
    let message = this.weixin;
    let xml = util.tpl(content, message);

    this.status = 200;
    this.type='application/xml';
    this.body = xml;
};

module.exports = Wechat;