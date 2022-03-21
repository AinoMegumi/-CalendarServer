'use strict';

class DateCompareManager {
    constructor(arr) {
        this.year = arr[0];
        this.month = arr[1];
        this.day = arr[2];
    }
    equal(data) {
        return this.cequal(Math.floor(data / 10000), Math.floor((data % 10000) / 100), data % 100);
    }
    not_equal(data) {
        return !this.equal(data);
    }
    less(data) {
        return this.cless(Math.floor(data / 10000), Math.floor((data % 10000) / 100), data % 100);
    }
    less_equal(data) {
        return this.less(data) || this.equal(data);
    }
    greater(data) {
        return !this.less_equal(data);
    }
    greater_equal(data) {
        return !this.less(data);
    }

    cequal(YearVal, MonthVal, DayVal) {
        return this.year === YearVal && this.month === MonthVal && this.day === DayVal;
    }
    cnot_equal(YearVal, MonthVal, DayVal) {
        return !this.cequal(YearVal, MonthVal, DayVal);
    }
    cless(YearVal, MonthVal, DayVal) {
        return (
            this.year < YearVal ||
            (this.year === YearVal && this.month < MonthVal) ||
            (this.year === YearVal && this.month === MonthVal && this.day < DayVal)
        );
    }
    cless_equal(YearVal, MonthVal, DayVal) {
        return this.cless(YearVal, MonthVal, DayVal) || this.cequal(YearVal, MonthVal, DayVal);
    }
    cgreater(YearVal, MonthVal, DayVal) {
        return !this.cless_equal(YearVal, MonthVal, DayVal);
    }
    cgreater_equal(YearVal, MonthVal, DayVal) {
        return !this.cless(YearVal, MonthVal, DayVal);
    }
}

module.exports = DateCompareManager;
