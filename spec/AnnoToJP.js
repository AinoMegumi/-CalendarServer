import dayjs from 'dayjs';
import { DateCompareManager } from './DateCompareManager.js';
import { JapaneseCalendarBorderTable } from './JapaneseCalendarBorderTable.js';
import { readFileSync } from 'fs';
const calendarInfo = JSON.parse(readFileSync('./japanese_calendar.json'));

/**
 *
 * @returns Array
 */
function GetBorderInformations() {
    const b = new Array();
    calendarInfo.borders.forEach(c => {
        b.push(new JapaneseCalendarBorderTable(c.jcalendar, c.jalphabet, c.begin));
    });
    return b;
}

const Borders = GetBorderInformations();


/**
 * 
 * @param {string|number} dateData 
 * @returns {dayjs.Dayjs|null}
 */
function ToDateCompareManager(dateData) {
    if (typeof dateData != 'number' && typeof dateData != 'string') return null;
    if (typeof dateData === 'number' && !Number.isFinite(dateData)) return null;
    const ret = typeof dateData === 'number' ? dayjs(dateData.toString()) : dayjs(dateData);
    return ret.isValid() ? DateCompareManager.FromDayjs(ret) : null;
}

/**
 * 指定された元号の表記、開始日、終了日を取得する
 * @param {string} era 
 * @returns {{ begin: { year: number, month: number, day: number }, end: { year: number, month: number, day: number } }|{ begin: { year: number, month: number, day: number } }|null}
 */
export function GetBorderInfoFromEra(era) {
    var i = 0;
    for (; i < Borders.length; i++) {
        const b = Borders[i];
        if (b.m_alphabet == era || b.m_jcalendar == era || b.m_jcalendar.substring(0, 1) == era) break;
    }
    if (i === Borders.length) return null;
    const beginInfo = Borders[i];
    const beginJson = {
        year: beginInfo.m_border.year,
        month: beginInfo.m_border.month,
        day: beginInfo.m_border.day
    };
    if (i === Borders.length - 1) {
        if (beginInfo.m_alphabet != era && beginInfo.m_jcalendar != era && beginInfo.m_jcalendar.substring(0, 1) != era) return null;
        return { begin: beginJson }
    }
    else {
        const endInfo = Borders[i + 1];
        var EndDate = new Date(endInfo.m_border.year, endInfo.m_border.month - 1, endInfo.m_border.day);
        EndDate.setDate(EndDate.getDate() - 1);
        return {
            begin: beginJson,
            end: {
                year: EndDate.getFullYear(),
                month: EndDate.getMonth() + 1,
                day: EndDate.getDate()
            }
        }
    }
}

/**
 * 指定された西暦の日付を和暦の日付に変換する
 * @param {string|number} dateData 
 * @returns { era: { long: string, short: string, alphabet: string }, border: { year: number, month: number, day: number }}
 */
export function GetJapaneseCalendar(dateData) {
    const dayInfo = ToDateCompareManager(dateData);
    if (dayInfo == null) return null;
    var i = 0;
    for (; i < Borders.length && Borders[i].m_border.less_equal(dayInfo); i++) {}
    if (i === 0) return null;
    const data = Borders[--i];
    return {
        era: {
            long: data.m_jcalendar,
            short: data.m_jcalendar.substring(0, 1),
            alphabet: data.m_alphabet
        },
        calendar: {
            year: dayInfo.year - data.m_border.year + 1,
            month: dayInfo.month,
            day: dayInfo.day
        }
    };
}

/**
 * 指定された日付の元号を取得する
 * @param {string|number} dateData
 * @returns {{long: string, short: string, alphabet: string}|null}
 */
export function GetEra(dateData) {
    const data = GetJapaneseCalendar(dateData);
    if (data == null) return null;
    return data.era;
}
