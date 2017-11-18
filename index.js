/**
 * Created by Jay on 2017/11/16.
 */
const {parse} = require('cookie');
const {CronJob} = require('cron');
const {stringify} = require('qs');
const {get, post} = require('request-promise');

const getId = async () => {
    const result = await get({
        url: 'http://weixin.scnjnews.com/index.php?g=Wap&m=Vote&a=index&token=Eioa5C5oj3S32qhH&id=1',
        resolveWithFullResponse: true
    });
    return ((result || {}).headers || {})['set-cookie'].map(i=>parse(i)).filter(i=>i.wxd_openid)[0].wxd_openid;
};

const vote = async (id) => {
    const result = await post({
        url: 'http://weixin.scnjnews.com/index.php?g=Wap&m=Vote&a=ticket',
        headers: {
            Cookie: stringify({
                wxd_openid: await getId()
            })
        },
        formData: {
            zid: id,
            vid: 1,
            token: 'Eioa5C5oj3S32qhH'
        }
    });
    if (result === '108') {
        console.log(`voted ${id}`);
    }
};

const voteAndWait = () => setTimeout(async ()=>{
    await vote(468);
    await vote(471);
    voteAndWait();
}, parseInt(process.env.COOL_DOWN));

voteAndWait();