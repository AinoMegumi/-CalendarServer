'use strict';

class DateCompareManager {
    /**
     * 
     * @param {number} Year 
     * @param {number} Month 
     * @param {number} Day 
     */
    constructor(Year, Month, Day) {
        this.year = Year;
        this.month = Month;
        this.day = Day;
    }
    /**
     * 
     * @param {DateCompareManager} dateCompMgr 
     * @returns bool
     */
    equal(dateCompMgr) {
        return this.year === dateCompMgr.year && this.month === dateCompMgr.month && this.day === dateCompMgr.day;
    }
    /**
     * 
     * @param {DateCompareManager} dateCompMgr 
     * @returns bool
     */
    not_equal(dateCompMgr) {
        return !this.cequal(dateCompMgr);
    }
    /**
     * 
     * @param {DateCompareManager} dateCompMgr 
     * @returns bool
     */
     less(dateCompMgr) {
        return (
            this.year < dateCompMgr.year ||
            (this.year === dateCompMgr.year && this.month < dateCompMgr.month) ||
            (this.year === dateCompMgr.year && this.month === dateCompMgr.month && this.day < dateCompMgr.day)
        );
    }
    /**
     * 
     * @param {DateCompareManager} dateCompMgr 
     * @returns bool
     */
     less_equal(dateCompMgr) {
        return this.cless(dateCompMgr) || this.cequal(dateCompMgr);
    }
    /**
     * 
     * @param {DateCompareManager} dateCompMgr 
     * @returns bool
     */
     greater(dateCompMgr) {
        return !this.cless_equal(dateCompMgr);
    }
    /**
     * 
     * @param {DateCompareManager} dateCompMgr 
     * @returns bool
     */
     greater_equal(dateCompMgr) {
        return !this.cless(dateCompMgr);
    }
}

module.exports = DateCompareManager;
