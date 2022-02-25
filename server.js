const express = require('express');
const app = express();
const fse = require('fs/promises');
const JapaneseCalendarBorder = require('./japanese_calendar_border_table');
const Borders = new Array();

const main = async() => {
    const calendar = JSON.parse(await fse.readFile("./japanese_calendar.json").catch(er => {
        console.error("Fail to open japanese_calendar.json", er);
		process.exit(1);
    }));
    calendar.borders.forEach(c => {
       Borders.push(new JapaneseCalendarBorder(c.jcalendar, c.jalphabet, c.begin));
    });

    const isValidDate = (val) => {
        const YearVal = Math.floor(val / 10000);
        const MonthVal = Math.floor((val % 10000) / 100);
        const DayVal = val % 100;
        if (MonthVal < 1 || 12 < MonthVal || DayVal < 1) return false;
        if (MonthVal === 2) {
            if (YearVal % 4 === 0) {
                if (YearVal % 100 === 0) return DayVal <= (YearVal % 400 === 0 ? 29 : 28);
                else return DayVal <= 29;
            }
            else return DayVal <= 28;
        }
        else if (MonthVal === 4 || MonthVal === 6 || MonthVal === 9 || MonthVal === 11) return DayVal <= 30;
        else return DayVal <= 31;
    };
    
    const createJapaneseCalendarResponseJsonImpl = (border, year, month, day) => 
        JSON.stringify({
            jcalendar: border.m_jcalendar,
            jalphabet: border.m_alphabet,
            year: (year - border.m_border.year + 1),
            mon: month,
            day: day
        });
    
    const cgetJapaneseCalendarData = (YearVal, MonthVal, DayVal) => {
        var i = 0;
        for (; i < Borders.length && Borders[i].m_border.cless_equal(YearVal, MonthVal, DayVal); i++) {}
        return Borders[--i];
    };
    
    const ccreateJapaneseCalendarResponseJson = (AnnoDominiYear, MonthVal, DayVal) => 
        createJapaneseCalendarResponseJsonImpl(cgetJapaneseCalendarData(AnnoDominiYear, MonthVal, DayVal), AnnoDominiYear, MonthVal, DayVal);
    
    const createJapaneseCalendarResponseJson = (data) => 
        ccreateJapaneseCalendarResponseJson(Math.floor(data / 10000), Math.floor((data % 10000) / 100), data % 100);    

    app.get('/api/japanese', (req, res) => {
        if (req.query.date != null) {
            var Cal = new Date();
            if (!isNaN(req.query.difference_from_today)) {
                v = parseInt(req.query.difference_from_today);
                if (!isNaN(v)) Cal.setDate(Cal.getDate() + v);
            }
            res.send(ccreateJapaneseCalendarResponseJson(Cal.getFullYear(), Cal.getMonth() + 1, Cal.getDate()));
        }
        else {
            const dateVal = parseInt(req.query.date);
            if (isNaN(dateVal)) return res.sendStatus(400);
            if (!isValidDate(dateVal) || dateVal < 19000101) return res.sendStatus(400);
            res.send(createJapaneseCalendarResponseJson(dateVal));
        }
    });
    app.get('/api/japanese/eras', (_, res) => {
        var arr = new Array();
        for (var i = 0; i < Borders.length - 1; i++) {
            const b = Borders[i];
            const r = Borders[i + 1].m_border;
            var c = new Date(r.year, r.month, r.day);
            c.setDate(c.getDate() - 1);
            arr.push({
                alphabet: b.m_alphabet,
                kanji: b.m_jcalendar
            });
        }
        res.send(JSON.stringify({ eras: arr }));
    });

    app.get('/api/anno_domini', (req, res) => {
        var Cal = new Date();
        if (req.query.difference_from_today != null) {
            v = parseInt(req.query.difference_from_today);
            if (!isNaN(v)) Cal.setDate(Cal.getDate() + v);
        }
        const resJson = {
            year: Cal.getFullYear(),
            mon: (Cal.getMonth() + 1),
            day: Cal.getDate()
        };
        res.send(JSON.stringify(resJson));
    });
    app.use(express.static('wwwroot'));
    app.use(express.json( { type:'application/*+json'}));
    app.listen(process.env.HTTP_PLATFORM_PORT || 8900);
};

main().catch(er => {
	console.error(er);
	process.exit(1);
});
