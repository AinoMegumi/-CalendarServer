import test from 'ava';
import { GetBorderInfoFromEra, GetJapaneseCalendar, GetEra } from '../../spec/AnnoToJP.js';
import { createSandbox, useFakeTimers } from 'sinon';

test('GetBorderInfoFromEra', t => {
    t.is(GetBorderInfoFromEra('元禄'), null);
    t.deepEqual(GetBorderInfoFromEra('令和'), { begin: { year: 2019, month: 5, day: 1 } });
    t.deepEqual(GetBorderInfoFromEra('平成'), {
        begin: { year: 1989, month: 1, day: 8 },
        end: { year: 2019, month: 4, day: 30 },
    });
});

test('GetJapaneseCalendar_NullParameter', t => {
    const useTime = new Date(2022, 6, 16);
    const Sandbox = createSandbox();
    const clock = useFakeTimers(useTime.getTime());
    try {
        t.deepEqual(GetJapaneseCalendar(null), {
            era: { long: '令和', short: '令', alphabet: 'R' },
            calendar: { year: 4, month: 7, day: 16 },
        });
    } finally {
        Sandbox.restore();
        clock.restore();
    }
});

test('GetJapaneseCalendar', t => {
    t.deepEqual(GetJapaneseCalendar(20190430), {
        era: { long: '平成', short: '平', alphabet: 'H' },
        calendar: { year: 31, month: 4, day: 30 },
    });
    t.deepEqual(GetJapaneseCalendar('20190430'), {
        era: { long: '平成', short: '平', alphabet: 'H' },
        calendar: { year: 31, month: 4, day: 30 },
    });
    t.deepEqual(GetJapaneseCalendar(20200403), {
        era: { long: '令和', short: '令', alphabet: 'R' },
        calendar: { year: 2, month: 4, day: 3 },
    });
    t.is(GetJapaneseCalendar('2019/04/30').era.alphabet, 'H');
    t.is(GetJapaneseCalendar('645/6/12'), null);
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
