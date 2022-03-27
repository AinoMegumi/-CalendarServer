import test from 'ava';
import { GetStartYear, parseStringMapToNumMap, dateSplit, JPToAnno } from '../spec/JPToAnno.js';

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

test('dateSplit_has_delimiter', t => {
    t.deepEqual(dateSplit('26.12.10'), { year: '26', month: '12', day:'10' });
    t.deepEqual(dateSplit('26-12-10'), { year: '26', month: '12', day:'10' });
    t.deepEqual(dateSplit('26/12/10'), { year: '26', month: '12', day:'10' });
    t.deepEqual(dateSplit('26.12-10'), { year: '26', month: '12', day:'10' });
    t.deepEqual(dateSplit('26.12/10'), { year: '26', month: '12', day:'10' });
    t.deepEqual(dateSplit('26/12-10'), { year: '26', month: '12', day:'10' });
    t.deepEqual(dateSplit('aa/bb/cc'), { year: 'aa', month: 'bb', day:'cc' });
});

test('dateSplit_no_delimiter', t => {
    t.deepEqual(dateSplit('261210'), { year: '26', month: '12', day:'10' });
    t.deepEqual(dateSplit('aabbcc'), { year: 'aa', month: 'bb', day:'cc' });
    t.is(dateSplit('1116'), null);
    t.deepEqual(dateSplit('61210'), { year: '6', month: '12', day:'10' });
    t.deepEqual(dateSplit('1261210'), { year: '126', month: '12', day:'10' });
    t.is(dateSplit('12345678'), null);
});

test('dateSplit_has_invalid_delimiter', t => {
    t.is(dateSplit('26_12/10'), null);
    t.is(dateSplit('26/1/2/10'), null);
});

test('JPToAnno', t => {
    t.deepEqual(JPToAnno('平成120312'), { year: 2000, month: 3, day: 12 });
    t.deepEqual(JPToAnno('平12/03-12'), { year: 2000, month: 3, day: 12 });
    t.deepEqual(JPToAnno('S4/02-19'), { year: 1929, month: 2, day: 19 });
    t.deepEqual(JPToAnno('R40209'), { year: 2022, month: 2, day: 9 });
    t.deepEqual(JPToAnno('M31.04.29'), { year: 1898, month: 4, day: 29 });
    t.is(JPToAnno('R429'), null);
});
