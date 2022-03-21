import test from 'ava';
import { GetStartYear, checkNaN, dateSplit } from '../spec/JPToAnno.js';

test('GetStartYear', t => {
    t.is(GetStartYear('平成'), 1989);
});

test('checkNaN', t => {
    t.deepEqual(checkNaN({ year: '1', month: '2', day: '3' }), { year: 1, month: 2, day: 3 });
    t.is(checkNaN({ year: 'null', month: '2', day: '3' }), null);
    t.is(checkNaN({ year: '1', month: 'null', day: '3' }), null);
    t.is(checkNaN({ year: '1', month: '2', day: 'null' }), null);
    t.is(checkNaN({ year: 'null', month: 'null', day: 'null' }), null);
    t.is(checkNaN(null), null);
    t.is(checkNaN(undefined), null);
});
