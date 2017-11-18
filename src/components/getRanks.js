const {load} = require('cheerio');
const {get} = require('request-promise');

const getRanks = async () => {
    const html = await get(`http://weixin.scnjnews.com/index.php?g=Wap&m=Vote&a=top&token=Eioa5C5oj3S32qhH&id=1`);
    const $ = load(html);
    const listItemNodes = $('#top300 > ul > a > li');
    const arr = [];
    listItemNodes.each((_, i)=>{
        arr.push({
            rank: parseInt($(i.children[0]).text()),
            id: parseInt($(i.children[1]).text()),
            vote: parseInt($(i.children[4]).text())
        });
    });
    return arr;
};

module.exports = getRanks;