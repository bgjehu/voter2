const {DateTime} = require('luxon');
const vote = require('./vote');
const getRanks = require('./getRanks');

const randomInt = (min, max) => {
    //The maximum is inclusive and the minimum is inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const timestamp = () => {
    const localTime = DateTime.local();
    const cn = localTime.setZone('Asia/Shanghai');
    const us = localTime.setZone('America/Chicago');
    return `${cn.day}日${cn.hour}时${cn.minute}分 (${us.toISO()})`;
};

const tryVote = async (id, max = 3) => {
    let voted = false;
    let tried = 0;
    while (!voted && tried < max) {
        voted = await vote(id);
        tried++;
        console.log(`${timestamp()} try vote for ${id} ${voted ? 'succeeded' : 'failed'}`);
    }
};

const voteRec = async () => {
    // early return for out of operation time
    const {hour} = DateTime.local().setZone('Asia/Shanghai');
    if (hour > 23 || hour < 7) {
        console.log(`${timestamp()} out of operation hours`);
        setTimeout(voteRec, 1 * 60 * 1000);
        return;
    }

    const desires = [{id: 468, rank: 1}, {id: 471, rank: 4}];
    const coolDown = {
        min: (parseInt(process.env.MIN_COOLDOWN_IN_MIN) || 5),
        max: (parseInt(process.env.MAX_COOLDOWN_IN_MIN) || 15)
    };
    const ranks = await getRanks();
    // rankItem {id, rank, vote}
    for (let desire of desires) {
        // init
        let desireVote = null;
        const currentVote = ranks.find(i => i.id === desire.id).vote;
        // diff strategy for diff desire rank
        if (desire.rank === 1) {
            const rankOneVote = ranks.find(i => i.rank === 1).vote;
            desireVote = randomInt(rankOneVote, rankOneVote + 200);
        } else {
            const desireRankMinusOneVote = ranks.find(i => i.rank === (desire.rank - 1)).vote;
            const desireRankVote = ranks.find(i => i.rank === desire.rank).vote;
            const diff = desireRankMinusOneVote - desireRankVote;
            const oneForthDiff = Math.floor(diff / 4);
            desireVote = randomInt(desireRankVote + oneForthDiff, desireRankMinusOneVote - oneForthDiff);
        }
        if (desireVote - currentVote > 500) {
            await tryVote(desire.id);
            await tryVote(desire.id);
        } else {
            await tryVote(desire.id);
        }
    }
    const randomCoolDown = randomInt(coolDown.min, coolDown.max) * 60 * 1000;
    setTimeout(voteRec, randomCoolDown);
};

module.exports = voteRec;