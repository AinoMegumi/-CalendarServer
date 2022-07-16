import test from 'ava';
import { server } from '../../server/index.js';
import request from 'supertest';

test('Get Japenese calendar from anno domini calendar', async t => {
    const res = await request(server()).get('/api/japanese').query({ date: '2021/06/01' }).send();
    t.is(res.status, 200);
    t.deepEqual(res.body, {
        era: { long: '令和', short: '令', alphabet: 'R' },
        calendar: { year: 3, month: 6, day: 1 },
    });
});

test('Invalid date parameter request', async t => {
    // このリクエストはDateやDayjsで正常な日付に補正できるので許可
    const res1 = await request(server()).get('/api/japanese').query({ date: '2021/06/31' }).send();
    t.is(res1.status, 200);
    // このリクエストはDateやDayjsで補正できないのでＮＧ
    const res2 = await request(server()).get('/api/japanese').query({ date: '2021/-6/31' }).send();
    t.is(res2.status, 400);
});

test('Get supported eras', async t => {
    const res = await request(server()).get('/api/japanese/eras').send();
    t.is(res.status, 200);
    t.deepEqual(res.body, {
        eras: [
            { alphabet: 'M', kanji: '明治' },
            { alphabet: 'T', kanji: '大正' },
            { alphabet: 'S', kanji: '昭和' },
            { alphabet: 'H', kanji: '平成' },
            { alphabet: 'R', kanji: '令和' },
        ],
    });
});

test('Get old borders', async t => {
    const res = await request(server()).get('/api/japanese/border').query({ era: '平成' }).send();
    t.is(res.status, 200);
    t.deepEqual(res.body, { begin: { year: 1989, month: 1, day: 8 }, end: { year: 2019, month: 4, day: 30 } });
});

test('Get latest borders', async t => {
    const res = await request(server()).get('/api/japanese/border').query({ era: '令和' }).send();
    t.is(res.status, 200);
    t.deepEqual(res.body, { begin: { year: 2019, month: 5, day: 1 } });
});

test('No Query Parameter on borders', async t => {
    const res = await request(server()).get('/api/japanese/border').send();
    t.is(res.status, 400);
});

test("Get border of unsupported era's", async t => {
    const res = await request(server()).get('/api/japanese/border').query({ era: '大化' }).send();
    t.is(res.status, 404);
});

test('Get anno domini calendar from Japanese calendar', async t => {
    const res = await request(server()).get('/api/anno_domini').query({ date: '令和4.04.10' }).send();
    t.is(res.status, 200);
    t.deepEqual(res.body, { year: 2022, month: 4, day: 10 });
});

test('No Query Parameter on anno domini converter', async t => {
    const res = await request(server()).get('/api/anno_domini').send();
    t.is(res.status, 400);
});

test('Invalid date on anno domini converter 1', async t => {
    const res = await request(server()).get('/api/anno_domini').query({ date: '令和-6.04.10' }).send();
    t.is(res.status, 404);
});

test('Invalid date on anno domini converter 2', async t => {
    // このリクエストは各種処理後にDateやDayjsで正常な日付に補正できるので許可
    const res1 = await request(server()).get('/api/anno_domini').query({ date: '令和6.04.31' }).send();
    t.is(res1.status, 200);
    t.deepEqual(res1.body, { year: 2024, month: 5, day: 1 });
    // // このリクエストは分解ができないのでＮＧ
    const res2 = await request(server()).get('/api/anno_domini').query({ date: '令和6.04.-1' }).send();
    t.is(res2.status, 404);
});

test('Invalid era on anno domini converter', async t => {
    const res = await request(server()).get('/api/anno_domini').query({ date: '大化6.04.10' }).send();
    t.is(res.status, 404);
});
