const {parse} = require('cookie');
const {stringify} = require('qs');
const {get, post} = require('request-promise');

const getToken = async () => {
    const result = await get({
        url: 'http://weixin.scnjnews.com/index.php?g=Wap&m=Vote&a=index&token=Eioa5C5oj3S32qhH&id=1',
        resolveWithFullResponse: true
    });
    return ((result || {}).headers || {})['set-cookie'].map(i=>parse(i)).filter(i=>i.wxd_openid)[0].wxd_openid;
};

const vote = async (id) => {
    try {
        const result = await post({
            url: 'http://weixin.scnjnews.com/index.php?g=Wap&m=Vote&a=ticket',
            headers: {
                Cookie: stringify({wxd_openid: await getToken()})
            },
            formData: {
                zid: id,
                vid: 1,
                token: 'Eioa5C5oj3S32qhH'
            }
        });
        return result === '108';
    } catch (_) {
        return false;
    }
};

module.exports = vote;