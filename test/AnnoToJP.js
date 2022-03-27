import test from 'ava';
import { GetBorderInfoFromEra, GetJapaneseCalendar, GetEra } from '../spec/AnnoToJP.js';

test('GetBorderInfoFromEra', t => {
    t.is(GetBorderInfoFromEra('元禄'), null);
    t.deepEqual(GetBorderInfoFromEra('令和'), { begin: { year: 2019, month: 5, day: 1 } });
    t.deepEqual(GetBorderInfoFromEra('平成'), {
        begin: { year: 1989, month: 1, day: 8 },
        end: { year: 2019, month: 4, day: 30 },
    });
});

test('GetJapaneseCalendar', t => {
    t.deepEqual(GetJapaneseCalendar(20190430), {
        era: { long: '平成', short: '平', alphabet: 'H' },
        calendar: { year: 31, month: 4, day: 30 },
    });
    t.is(GetJapaneseCalendar('20190430').era.alphabet, 'H');
    t.is(GetJapaneseCalendar('2019/04/30').era.alphabet, 'H');
    t.is(GetJapaneseCalendar(new Date(2019, 4, 30)), null); // Date型の扱いがちょっと厄介なので非サポート
});

test('GetEra', t => {
    t.is(GetEra(NaN), null);
    t.is(GetEra(Infinity), null);
    t.deepEqual(GetEra(20190430), { long: '平成', short: '平', alphabet: 'H' });
    t.deepEqual(GetEra('20190430'), { long: '平成', short: '平', alphabet: 'H' });
    t.deepEqual(GetEra('2019/04/30'), { long: '平成', short: '平', alphabet: 'H' });
    t.is(GetEra(new Date(2019, 4, 30)), null);
});
