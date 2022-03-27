import test from 'ava';
import { DateCompareManager } from '../spec/DateCompareManager.js';
const CompareTarget = new DateCompareManager(2019, 3, 6);

test('DateCompareManager/equal', t => {
    t.is(CompareTarget.equal(new DateCompareManager(2019, 3, 6)), true);
    t.is(CompareTarget.equal(new DateCompareManager(2020, 3, 6)), false);
    t.is(CompareTarget.equal(new DateCompareManager(2019, 4, 6)), false);
    t.is(CompareTarget.equal(new DateCompareManager(2019, 3, 7)), false);
});

test('DateCompareManager/less_equal', t => {
    t.is(CompareTarget.less_equal(new DateCompareManager(2019, 3, 6)), true);

    t.is(CompareTarget.less_equal(new DateCompareManager(2020, 3, 6)), true);
    t.is(CompareTarget.less_equal(new DateCompareManager(2019, 4, 6)), true);
    t.is(CompareTarget.less_equal(new DateCompareManager(2019, 3, 7)), true);

    t.is(CompareTarget.less_equal(new DateCompareManager(2018, 3, 6)), false);
    t.is(CompareTarget.less_equal(new DateCompareManager(2019, 2, 6)), false);
    t.is(CompareTarget.less_equal(new DateCompareManager(2019, 3, 5)), false);
});

test('DateCompareManager/less', t => {
    t.is(CompareTarget.less(new DateCompareManager(2019, 3, 6)), false);

    t.is(CompareTarget.less(new DateCompareManager(2020, 3, 6)), true);
    t.is(CompareTarget.less(new DateCompareManager(2019, 4, 6)), true);
    t.is(CompareTarget.less(new DateCompareManager(2019, 3, 7)), true);

    t.is(CompareTarget.less(new DateCompareManager(2018, 3, 6)), false);
    t.is(CompareTarget.less(new DateCompareManager(2019, 2, 6)), false);
    t.is(CompareTarget.less(new DateCompareManager(2019, 3, 5)), false);
});

test('DateCompareManager/greater_equal', t => {
    t.is(CompareTarget.greater_equal(new DateCompareManager(2019, 3, 6)), true);

    t.is(CompareTarget.greater_equal(new DateCompareManager(2020, 3, 6)), false);
    t.is(CompareTarget.greater_equal(new DateCompareManager(2019, 4, 6)), false);
    t.is(CompareTarget.greater_equal(new DateCompareManager(2019, 3, 7)), false);

    t.is(CompareTarget.greater_equal(new DateCompareManager(2018, 3, 6)), true);
    t.is(CompareTarget.greater_equal(new DateCompareManager(2019, 2, 6)), true);
    t.is(CompareTarget.greater_equal(new DateCompareManager(2019, 3, 5)), true);
});

test('DateCompareManager/greater', t => {
    t.is(CompareTarget.greater(new DateCompareManager(2019, 3, 6)), false);

    t.is(CompareTarget.greater(new DateCompareManager(2020, 3, 6)), false);
    t.is(CompareTarget.greater(new DateCompareManager(2019, 4, 6)), false);
    t.is(CompareTarget.greater(new DateCompareManager(2019, 3, 7)), false);

    t.is(CompareTarget.greater(new DateCompareManager(2018, 3, 6)), true);
    t.is(CompareTarget.greater(new DateCompareManager(2019, 2, 6)), true);
    t.is(CompareTarget.greater(new DateCompareManager(2019, 3, 5)), true);
});

test('DateCompareManager/not_equal', t => {
    t.is(CompareTarget.not_equal(new DateCompareManager(2019, 3, 6)), false);
    t.is(CompareTarget.not_equal(new DateCompareManager(2020, 3, 6)), true);
    t.is(CompareTarget.not_equal(new DateCompareManager(2019, 4, 6)), true);
    t.is(CompareTarget.not_equal(new DateCompareManager(2019, 3, 7)), true);
});
