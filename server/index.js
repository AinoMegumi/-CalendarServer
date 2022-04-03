import express from 'express';
import { GetJapaneseCalendar, GetBorderInfoFromEra } from '../spec/AnnoToJP.js';
import { JPToAnno } from '../spec/JPToAnno.js';
const app = express();
const Borders = [];

const main = async () => {
    app.get('/api/japanese', (req, res) => res.send(GetJapaneseCalendar(req.query.date)));
    app.get('/api/japanese/eras', (_, res) => {
        res.send(JSON.stringify({ eras: Borders.map(b => ({ alphabet: b.m_alphabet, kanji: b.m_jcalendar })) }));
    });
    app.get('/api/japanese/border', (req, res) => {
        if (!req.query.era) return res.sendStatus(400);
        res.sendStatus(GetBorderInfoFromEra(req.query.era));
    });
    app.get('/api/anno_domini', (req, res) => {
        if (!req.query.date) return res.sendStatus(400);
        res.send(JPToAnno(req.query.date));
    });
    app.use(express.static('wwwroot'));
    app.use(express.json({ type: 'application/*+json' }));
    app.listen(process.env.HTTP_PLATFORM_PORT || 8900);
};

main().catch(er => {
    console.error(er);
    process.exit(1);
});
