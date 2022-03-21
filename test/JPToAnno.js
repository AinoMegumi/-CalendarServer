import test from 'ava';
import { GetStartYear, checkNaN, dateSplit } from '../spec/JPToAnno.js';

test('GetStartYear', t => {
    t.is(GetStartYear('平成'), 1989);
});
