import test from 'ava';
import { GetStartYear, parseStringMapToNumMap, dateSplit } from '../spec/JPToAnno.js';

test('GetStartYear', t => {
    t.is(GetStartYear('平成'), 1989);
});

test('parseStringMapToNumMap', t => {
    t.deepEqual(parseStringMapToNumMap({ year: '1', month: '2', day: '3' }), { year: 1, month: 2, day: 3 });
    t.is(parseStringMapToNumMap({ year: 'null', month: '2', day: '3' }), null);
    t.is(parseStringMapToNumMap({ year: '1', month: 'null', day: '3' }), null);
    t.is(parseStringMapToNumMap({ year: '1', month: '2', day: 'null' }), null);
    t.is(parseStringMapToNumMap({ year: 'null', month: 'null', day: 'null' }), null);
    t.is(parseStringMapToNumMap(null), null);
    t.is(parseStringMapToNumMap(undefined), null);
});
