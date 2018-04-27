'use script'

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));

var prefix = 'https://api.weixin.qq.com/cgi-bin/';
var api = {
    accessToken: prefix + 'token?grant_type=client_credential'
};
function Wechat(opts) {
    var that = this;
    this.appID = opts.appID;
    this.appSecret = opts.appSecret;
    this.getAccessToken = opts.getAccessToken;
    this.saveAccessToken = opts.saveAccessToken;
    this.getAccessToken()
        .then(function (data) {
            try {
                data = JSON.parse(data)
            } catch (e) {
                return that.updateAccessToken(data);
            }

            if (that.isValidAccessToken(data)) {
                Promise.resolve(data)
            } else {
                return that.updateAccessToken();
            }
        })
        .then(function (data) {
            if (data === undefined) {
                return ;
            }
            that.access_token = data.access_token;
            that.expires_in = data.expires_in;

            that.saveAccessToken(data);
        });
}

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

module.exports = Wechat;