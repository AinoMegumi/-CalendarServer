'use strict';
import DateCompareManager from './DateCompareManager';

class JapaneseCalendarBorderTable {
    constructor(jcalendar, alphabet, borderArr) {
        this.m_jcalendar = jcalendar;
        this.m_alphabet = alphabet;
        this.m_border = new DateCompareManager(borderArr[0], borderArr[1], borderArr[2]);
    }
}

module.exports = JapaneseCalendarBorderTable;
