import test from 'ava';
import { server } from '../../server/index.js';
import request from 'supertest';

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

test('Get anno domini calendar from Japanese calendar', async t => {
    const res = await request(server()).get('/api/anno_domini').query({ date: '令和4.04.10' }).send();
    t.is(res.status, 200);
    t.deepEqual(res.body, { year: 2022, month: 4, day: 10 });
});

