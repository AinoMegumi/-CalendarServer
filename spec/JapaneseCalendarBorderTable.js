import { DateCompareManager } from './DateCompareManager.js';

export class JapaneseCalendarBorderTable {
    /**
     * 
     * @param {string} jcalendar 
     * @param {string} alphabet 
     * @param {Array<number>} borderArr 
     */
    constructor(jcalendar, alphabet, borderArr) {
        this.m_jcalendar = jcalendar;
        this.m_alphabet = alphabet;
        this.m_border = new DateCompareManager(borderArr[0], borderArr[1], borderArr[2]);
    }
}
