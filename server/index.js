import express from 'express';
import { GetJapaneseCalendar, GetBorderInfoFromEra, GetAllEras } from '../spec/AnnoToJP.js';
import { JPToAnno } from '../spec/JPToAnno.js';
import { readFileSync } from 'fs';
const app = express();

export const server = () => {
    app.get('/api/japanese', (req, res) => {
        const resData = GetJapaneseCalendar(req.query.date);
        if (resData == null) return res.sendStatus(400);
        res.send(resData);
    });
    app.get('/api/japanese/eras', (_, res) => {
        res.send(GetAllEras());
    });
    app.get('/api/japanese/border', (req, res) => {
        if (!req.query.era) return res.sendStatus(400);
        const resData = GetBorderInfoFromEra(req.query.era);
        if (resData == null) return res.sendStatus(404);
        res.send(resData);
    });
    app.get('/api/anno_domini', (req, res) => {
        if (!req.query.date) return res.sendStatus(400);
        const resData = JPToAnno(req.query.date);
        if (resData == null) return res.sendStatus(404);
        res.send(resData);
    });
    app.get('/api/spec', (_, res) => {
        res.send(readFileSync('./openapi.json'));
    });
    app.use(express.static('wwwroot'));
    app.use(express.json({ type: 'application/*+json' }));
    return app;
};

server().listen(process.env.HTTP_PLATFORM_PORT || 8900);
