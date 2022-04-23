import express from 'express';
import { GetJapaneseCalendar, GetBorderInfoFromEra } from '../spec/AnnoToJP.js';
import { JPToAnno } from '../spec/JPToAnno.js';
const app = express();
const Borders = [];

export const server = () => {
    app.get('/api/japanese', (req, res) => {
        const resData = GetJapaneseCalendar(req.query.date);
        if (resData == null) return res.sendStatus(400);
        res.send(resData);
    });
    app.get('/api/japanese/eras', (_, res) => {
        res.send(JSON.stringify({ eras: Borders.map(b => ({ alphabet: b.m_alphabet, kanji: b.m_jcalendar })) }));
    });
    app.get('/api/japanese/border', (req, res) => {
        if (!req.query.era) return res.sendStatus(400);
        const resData = GetBorderInfoFromEra(req.query.era);
        if (resData == null) return res.sendStatus(404);
        res.sendStatus(resData);
    });
    app.get('/api/anno_domini', (req, res) => {
        if (!req.query.date) return res.sendStatus(400);
        const resData = JPToAnno(req.query.date);
        if (resData == null) return res.sendStatus(404);
        res.send(resData);
    });
    app.use(express.static('wwwroot'));
    app.use(express.json({ type: 'application/*+json' }));
    return app;
};

server().listen(process.env.HTTP_PLATFORM_PORT || 8900);
