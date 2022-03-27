const ready = loaded => {
    if (['interactive', 'complete'].includes(document.readyState)) {
        loaded();
    } else {
        document.addEventListener('DOMContentLoaded', loaded);
    }
};

const AddOption1 = (Target, Val, View) => {
    const opt = document.createElement('option');
    opt.value = Val;
    opt.innerText = View;
    Target.appendChild(opt);
};

const AddOption = (Target, Val) => AddOption1(Target, Val, Val);

const AddOptionInSectionFromLargeVal = (Target, Max, Min) => {
    for (let i = Max; i >= Min; i--) AddOption(Target, i);
};

const AddOptionInSectionFromSmallVal = (Target, Max, Min) => {
    for (let i = Min; i <= Max; i++) AddOption(Target, i);
};

const CopyToClipboard = data => {
    navigator.clipboard.writeText(data);
};

const openTab = (evt, id) => {
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = 'none';
    }

    const tablinks = document.getElementsByClassName('tablinks');
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    document.getElementById(id).style.display = 'block';
    evt.currentTarget.className += ' active';
};

const AnnoToJP = () => {
    const Today = new Date();
    const year = document.getElementById('anno_year');
    const month = document.getElementById('anno_month');
    const day = document.getElementById('anno_day');
    const convert = document.getElementById('calc_jp');
    const result = document.getElementById('result_jp');
    AddOptionInSectionFromLargeVal(year, Today.getFullYear(), 1900);
    AddOptionInSectionFromSmallVal(month, 12, 1);
    AddOptionInSectionFromSmallVal(day, 31, 1);
    const YearAndMonthEventListener = () => {
        result.style.display = 'none';
        const d = new Date(year.value, month.value, 0).getDate();
        while (d < day.options.length) day.removeChild(day.lastChild);
        AddOptionInSectionFromSmallVal(day, d, parseInt(day.lastChild.value) + 1);
    };
    year.addEventListener('change', YearAndMonthEventListener);
    month.addEventListener('change', YearAndMonthEventListener);
    day.addEventListener('change', () => {
        result.style.display = 'none';
    });
    convert.addEventListener('click', () => {
        const cal = parseInt(year.value) * 10000 + parseInt(month.value) * 100 + parseInt(day.value);
        fetch('./api/japanese?date=' + cal)
            .then(res => res.json())
            .then(r => {
                result.style.display = 'block';
                document.getElementById('result_jp_calendar1').value = r.jcalendar;
                document.getElementById('result_jp_year1').value = r.year;
                document.getElementById('result_jp_month1').value = r.mon;
                document.getElementById('result_jp_day1').value = r.day;
                document.getElementById('result_jp_calendar2').value = r.jalphabet;
                document.getElementById('result_jp_year2').value = r.year;
                document.getElementById('result_jp_month2').value = r.mon;
                document.getElementById('result_jp_day2').value = r.day;
            });
    });
};

const JPToAnno = () => {
    const result = document.getElementById('result_anno');
    const eraList = document.getElementById('jp_era');
    const yearList = document.getElementById('jp_year');
    const monthList = document.getElementById('jp_month');
    const dayList = document.getElementById('jp_day');
    const calcButton = document.getElementById('calc_anno');
    const ClearSelectList = Target => {
        while (0 < Target.options.length) Target.removeChild(Target.firstChild);
    };

    const CreateMonthAndDayListFromBorderInfo = createYearList => {
        fetch('./api/japanese/border?era=' + eraList.value)
            .then(res => res.json())
            .then(r => {
                ClearSelectList(monthList);
                ClearSelectList(dayList);
                if (createYearList) AddOptionInSectionFromSmallVal(yearList, r.end.japanese_year, 1);
                if (r.begin.japanese_year < r.end.japanese_year) {
                    AddOptionInSectionFromSmallVal(monthList, 12, r.begin.month);
                    AddOptionInSectionFromSmallVal(
                        dayList,
                        new Date(r.begin.anno_year, r.begin.month, 0).getDate(),
                        r.begin.day
                    );
                } else {
                    AddOptionInSectionFromSmallVal(monthList, r.end.month, r.begin.month);
                    if (r.begin.month < r.begin.month)
                        AddOptionInSectionFromSmallVal(
                            dayList,
                            new Date(r.begin.anno_year, r.begin.month, 0).getDate(),
                            r.begin.day
                        );
                    else AddOptionInSectionFromSmallVal(dayList, r.end.day, r.begin.day);
                }
            })
            .catch(er => console.log(er));
    };

    fetch('./api/japanese/eras')
        .then(res => res.json())
        .then(r => {
            r.eras.forEach(e => {
                AddOption1(eraList, e.alphabet, e.kanji);
            });
            eraList.selectedIndex = eraList.options.length - 1;
            CreateMonthAndDayListFromBorderInfo(true);
        })
        .catch(er => console.log(er));
    eraList.addEventListener('change', () => {
        result.style.display = 'none';
        fetch('./api/japanese/max_year?era=' + eraList.value)
            .then(res => res.json())
            .then(r => {
                const maxYear = parseInt(r.max_year);
                while (maxYear < yearList.options.length) yearList.removeChild(yearList.lastChild);
                AddOptionInSectionFromSmallVal(yearList, maxYear, parseInt(yearList.lastChild.value) + 1);
                CreateMonthAndDayListFromBorderInfo(false);
            })
            .catch(er => console.log(er));
    });
    yearList.addEventListener('change', () => {
        result.style.display = 'none';
        fetch('./api/japanese/month?year=' + eraList.value + yearList.value)
            .then(res => res.json())
            .then(r => {
                ClearSelectList(monthList);
                AddOptionInSectionFromSmallVal(monthList, parseInt(r.max), parseInt(r.min));
                fetch('./api/japanese/day?year=' + eraList.value + yearList.value + '&month=' + monthList.value)
                    .then(res => res.json())
                    .then(r => {
                        ClearSelectList(dayList);
                        AddOptionInSectionFromSmallVal(dayList, parseInt(r.max), parseInt(r.min));
                    })
                    .catch(er => console.log(er));
            })
            .catch(er => console.log(er));
    });
    monthList.addEventListener('change', () => {
        result.style.display = 'none';
        fetch('./api/japanese/day?year=' + eraList.value + yearList.value + '&month=' + monthList.value)
            .then(res => res.json())
            .then(r => {
                ClearSelectList(dayList);
                AddOptionInSectionFromSmallVal(dayList, parseInt(r.max), parseInt(r.min));
            })
            .catch(er => console.log(er));
    });
    dayList.addEventListener('change', () => (result.style.display = 'none'));
    calcButton.addEventListener('click', () => {
        const dateNum = parseInt(yearList.value) * 10000 + parseInt(monthList.value) * 100 + parseInt(dayList.value);
        fetch('./api/anno_domini?date=' + eraList.value + dateNum)
            .then(res => res.json())
            .then(r => {
                result.style.display = 'block';
                document.getElementById('result_anno_year1').value = r.year;
                document.getElementById('result_anno_month1').value = r.mon;
                document.getElementById('result_anno_day1').value = r.day;
                document.getElementById('result_anno_year2').value = r.year;
                document.getElementById('result_anno_month2').value = r.mon;
                document.getElementById('result_anno_day2').value = r.day;
            });
    });
};

const SetupCopyButton = () => {
    $(document).ready(() => {
        toastr.options.timeOut = 3000; // 3秒
        toastr.options = {
            closeButton: true,
            debug: false,
            newestOnTop: false,
            progressBar: false,
            positionClass: 'toast-bottom-right',
            preventDuplicates: false,
            showDuration: '300',
            hideDuration: '1000',
            timeOut: '5000',
            extendedTimeOut: '1000',
            showEasing: 'swing',
            hideEasing: 'linear',
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut',
        };
        document.getElementById('copy_to_clipboard1').addEventListener('click', () => {
            CopyToClipboard(
                document.getElementById('result_jp_calendar1').value +
                    document.getElementById('result_jp_year1').value +
                    '年' +
                    document.getElementById('result_jp_month1').value +
                    '月' +
                    document.getElementById('result_jp_day1').value +
                    '日'
            );
            toastr['success']('クリップボードにコピーしました', '成功');
        });
        document.getElementById('copy_to_clipboard2').addEventListener('click', () => {
            CopyToClipboard(
                document.getElementById('result_jp_calendar2').value +
                    document.getElementById('result_jp_year2').value +
                    '.' +
                    document.getElementById('result_jp_month2').value +
                    '.' +
                    document.getElementById('result_jp_day2').value
            );
            toastr['success']('クリップボードにコピーしました', '成功');
        });
        document.getElementById('copy_to_clipboard3').addEventListener('click', () => {
            CopyToClipboard(
                document.getElementById('result_anno_year1').value +
                    '年' +
                    document.getElementById('result_anno_month1').value +
                    '月' +
                    document.getElementById('result_anno_day1').value +
                    '日'
            );
            toastr['success']('クリップボードにコピーしました', '成功');
        });
        document.getElementById('copy_to_clipboard4').addEventListener('click', () => {
            CopyToClipboard(
                document.getElementById('result_anno_year2').value +
                    '.' +
                    document.getElementById('result_anno_month2').value +
                    '.' +
                    document.getElementById('result_anno_day2').value
            );
            toastr['success']('クリップボードにコピーしました', '成功');
        });
    });
};

const LoadAPIReference = () => {
    fetch('./api_reference.md')
        .then(res => res.text())
        .then(r => {
            const markdown = marked.parse(r);
            document.getElementById('api_reference').innerHTML = markdown;
        })
        .catch(er => console.log(er));
};

ready(() => {
    LoadAPIReference();
    AnnoToJP();
    JPToAnno();
    SetupCopyButton();
    document.getElementById('defaultOpen').click();
});
