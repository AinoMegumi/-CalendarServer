import { readFileSync } from 'fs';
const calendarInfo = JSON.parse(readFileSync('./japanese_calendar.json'));

/**
 * 指定元号の始まりの年を取得する
 * @param {string} era
 * @returns {number|null}
 */
export function GetStartYear(era) {
    for (const cal of calendarInfo.borders) {
        const longEra = cal.jcalendar;
        if (longEra === era || longEra.substring(0, 1) === era || cal.jalphabet === era) return cal.begin[0];
    }
    return null;
}

/**
 * 日付を年・月・日に分割する
 * @param {string} dateNum
 * @returns
 */
export function dateSplit(dateNum) {
    const splitData = dateNum.split(/[/.-]/);
    if (splitData.length === 3) {
        return {
            year: splitData[0],
            month: splitData[1],
            day: splitData[2],
        };
    } else if (splitData.length === 1) {
        if (dateNum.length < 5 || dateNum.length > 7) return null;
        return {
            year: dateNum.substring(0, dateNum.length - 4),
            month: dateNum.substring(dateNum.length - 4, dateNum.length - 2),
            day: dateNum.substring(dateNum.length - 2),
        };
    } else return null;
}

/**
 * 和暦日付を西暦日付に変換する
 * @param {string} jpCalendar
 * @returns { year: number, month: number, day: number }
 */
export function JPToAnno(jpCalendar) {
    const dateInfo = jpCalendar.match(/(?<era>[^\d]+)(?<year>\d{1,3})[-/.]*(?<month>\d{2})[-/.]*(?<day>\d{2})/);
    if (dateInfo == null || dateInfo.length !== 5) return null;
    const StartYear = GetStartYear(dateInfo.groups.era);
    if (StartYear == null) return null;
    // 日付の補正をかける
    const CorrectDate = new Date(parseInt(dateInfo.groups.year) + StartYear - 1, parseInt(dateInfo.groups.month) - 1, parseInt(dateInfo.groups.day));
    return {
        year: CorrectDate.getFullYear(),
        month: CorrectDate.getMonth() + 1,
        day: CorrectDate.getDate(),
    };
}
