'use strict';

class DateCompareManager {
    /**
     * コンストラクター
     * @param {number} Year
     * @param {number} Month 1-12
     * @param {number} Day 1-31
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
     * 指定された日付データと比較し、引数の値と一致しない場合はtrueを返す
     * @param {DateCompareManager} dateCompMgr
     * @returns bool
     */
    not_equal(dateCompMgr) {
        return !this.cequal(dateCompMgr);
    }
    /**
     * 指定された日付データと比較し、引数の値の方が大きい場合はtrueを返す
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
     * 指定された日付データと比較し、引数の値の方が大きいまたは等しい場合はtrueを返す
     * @param {DateCompareManager} dateCompMgr
     * @returns bool
     */
     less_equal(dateCompMgr) {
        return this.cless(dateCompMgr) || this.cequal(dateCompMgr);
    }
    /**
     * 指定された日付データと比較し、引数の値の方が小さい場合はtrueを返す
     * @param {DateCompareManager} dateCompMgr
     * @returns bool
     */
     greater(dateCompMgr) {
        return !this.cless_equal(dateCompMgr);
    }
    /**
     * 指定された日付データと比較し、引数の値の方が小さいまたは等しい場合はtrueを返す
     * @param {DateCompareManager} dateCompMgr
     * @returns bool
     */
     greater_equal(dateCompMgr) {
        return !this.cless(dateCompMgr);
    }
}

module.exports = DateCompareManager;
