import test from 'ava';
import { server } from '../../server/index.js';
import request from 'supertest';

test('Get borders', async t => {
    const res = await request(server()).get('/api/japanese/border').query({ era: '平成' }).send();
    t.is(res.status, 200);
    t.deepEqual(res.body, { begin: { year: 1989, month: 1, day: 8 }, end: { year: 2019, month: 4, day: 30 } });
});
