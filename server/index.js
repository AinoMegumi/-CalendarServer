import express from 'express';
import fse from 'fs/promises';
import JapaneseCalendarBorder from '../spec/JapaneseCalendarBorderTable.js';
import { GetJapaneseCalendar, GetBorderInfoFromEra } from '../spec/AnnoToJP.js';
const app = express();
const Borders = [];

const main = async () => {
    const calendar = JSON.parse(
        await fse.readFile('./japanese_calendar.json').catch(er => {
            console.error('Fail to open japanese_calendar.json', er);
            process.exit(1);
        })
    );
    calendar.borders.forEach(c => {
        Borders.push(new JapaneseCalendarBorder(c.jcalendar, c.jalphabet, c.begin));
    });

    const isValidDate = val => {
        const YearVal = Math.floor(val / 10000);
        const MonthVal = Math.floor((val % 10000) / 100);
        const DayVal = val % 100;
        if (MonthVal < 1 || 12 < MonthVal || DayVal < 1) return false;
        if (MonthVal === 2) {
            if (YearVal % 4 === 0) {
                if (YearVal % 100 === 0) return DayVal <= (YearVal % 400 === 0 ? 29 : 28);
                else return DayVal <= 29;
            } else return DayVal <= 28;
        } else if (MonthVal === 4 || MonthVal === 6 || MonthVal === 9 || MonthVal === 11) return DayVal <= 30;
        else return DayVal <= 31;
    };

    const createJapaneseCalendarResponseJsonImpl = (border, year, month, day) =>
        JSON.stringify({
            jcalendar: border.m_jcalendar,
            jalphabet: border.m_alphabet,
            year: year - border.m_border.year + 1,
            mon: month,
            day: day,
        });

    const cgetJapaneseCalendarData = (YearVal, MonthVal, DayVal) => {
        let i = 0;
        for (; i < Borders.length && Borders[i].m_border.cless_equal(YearVal, MonthVal, DayVal); i++);
        return Borders[--i];
    };

    const ccreateJapaneseCalendarResponseJson = (AnnoDominiYear, MonthVal, DayVal) =>
        createJapaneseCalendarResponseJsonImpl(
            cgetJapaneseCalendarData(AnnoDominiYear, MonthVal, DayVal),
            AnnoDominiYear,
            MonthVal,
            DayVal
        );

    const getLastDate = NextEraBorderInfo => {
        const d = new Date(NextEraBorderInfo.year, NextEraBorderInfo.month - 1, NextEraBorderInfo.day);
        d.setDate(d.getDate() - 1);
        return d;
    };

    const getBorderDataFromEra = era => {
        let i = 0;
        for (; i < Borders.length - 1; i++) {
            if (
                era.toUpperCase() === Borders[i].m_alphabet ||
                era === Borders[i].m_jcalendar ||
                era === Borders[i].m_jcalendar.substring(0, 1)
            ) {
                const LastDate = getLastDate(Borders[i + 1].m_border);
                return {
                    begin: {
                        year: Borders[i].m_border.year,
                        month: Borders[i].m_border.month,
                        day: Borders[i].m_border.day,
                    },
                    end: {
                        year: LastDate.getFullYear(),
                        month: LastDate.getMonth() + 1,
                        day: LastDate.getDate(),
                    },
                };
            }
        }
        if (
            era.toUpperCase() === Borders[Borders.length - 1].m_alphabet ||
            era === Borders[Borders.length - 1].m_jcalendarB
        ) {
            const Today = new Date();
            return {
                begin: {
                    year: Borders[i].m_border.year,
                    month: Borders[i].m_border.month,
                    day: Borders[i].m_border.day,
                },
                end: {
                    year: Today.getFullYear(),
                    month: Today.getMonth() + 1,
                    day: Today.getDate(),
                },
            };
        }
        return null;
    };

    const SplitEraAndDateVal = reqDate => {
        const date = reqDate.replaceAll('.', '');
        let i = 0;
        for (; i < date.length && !date.substring(i, i + 1).match(/[0-9,-]/); i++);
        const v = date.substring(i);
        return isNaN(v) ? null : { era: date.substring(0, i), date: parseInt(v) };
    };

    app.get('/api/japanese', (req, res) => res.send(GetJapaneseCalendar(req.query.date)));
    app.get('/api/japanese/eras', (_, res) => {
        res.send(JSON.stringify({ eras: Borders.map(b => ({ alphabet: b.m_alphabet, kanji: b.m_jcalendar })) }));
    });
    app.get('/api/japanese/border', (req, res) => {
        if (!req.query.era) return res.sendStatus(400);
        res.sendStatus(GetBorderInfoFromEra(req.query.era));
    });
    app.get('/api/anno_domini', (req, res) => {
        let Cal = new Date();
        if (req.query.date) {
            const date = SplitEraAndDateVal(req.query.date);
            if (date === null) return res.sendStatus(400);
            if (date.date < 10101) return res.sendStatus(400);
            const border = getBorderDataFromEra(date.era);
            if (border === null) return res.sendStatus(404);
            const year = Math.floor(date.date / 10000) + border.begin.year - 1;
            const month = Math.floor((date.date % 10000) / 100);
            const day = date.date % 100;
            if (month < 1 || month > 12) return res.sendStatus(400);
            const MonthLastDay = new Date(year, month, 0).getDate();
            if (day < 1 || day > MonthLastDay) return res.sendStatus(400);
            Cal = new Date(year, month - 1, day);
        }
        if (req.query.difference_from_today) {
            if (isNaN(req.query.difference_from_today)) return res.sendStatus(400);
            Cal.setDate(Cal.getDate() + parseInt(req.query.difference_from_today));
        }
        res.send(
            JSON.stringify({
                year: Cal.getFullYear(),
                mon: Cal.getMonth() + 1,
                day: Cal.getDate(),
            })
        );
    });
    app.use(express.static('wwwroot'));
    app.use(express.json({ type: 'application/*+json' }));
    app.listen(process.env.HTTP_PLATFORM_PORT || 8900);
};

main().catch(er => {
    console.error(er);
    process.exit(1);
});
