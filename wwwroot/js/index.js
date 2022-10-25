toastr.options = {
    timeOut: 3000, // 3秒
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-bottom-right',
    preventDuplicates: false,
    showDuration: '300',
    hideDuration: '1000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
};

const CopyToClipboard = data => {
    navigator.clipboard.writeText(data);
    toastr['success']('クリップボードにコピーしました', '成功');
};

const CreateMenu = ActiveRoute => {
    const Menu = {
        menubutton: (route, text) => {
            return route === ActiveRoute
                ? m('button.tablinks active', text)
                : m('button.tablinks', { onclick: () => (Menu.current = location.href = '/#!' + route) }, text);
        },
        view: () => {
            return m('div.tab', [
                Menu.menubutton('/convert_to_jp', '西暦 -> 和暦'),
                Menu.menubutton('/convert_to_anno', '和暦 -> 西暦'),
            ]);
        },
    };
    return Menu;
};

const Era = {
    eras: [],
    oninit: () => {
        console.log('init start');
        return (
            m
                .request({ method: 'GET', url: './api/japanese/eras' })
                // return fetch('./api/japanese/eras')
                // .then(res => res.json())
                .then(r => {
                    Era.eras = r.eras.map(e => e.kanji).reverse();
                    console.log('requested', Era.eras);
                    m.redraw();
                })
                .catch(e => console.log(e))
        );
    },
    view: () => Era.eras.map(era => m('option', { value: era }, era)),
};

const ConvertAnnoToJP = {
    date_: '',
    result_: '',
    convert: async date => {
        const param = { date: date };
        const queryParam = new URLSearchParams(param);
        const r = await fetch('./api/japanese?' + queryParam).then(res => res.json());
        return r.era.long + r.calendar.year + '年' + r.calendar.month + '月' + r.calendar.day + '日';
    },
    view: () => {
        return m('section', [
            m(CreateMenu('/convert_to_jp')),
            m('div.tabcontent', [
                m('h3', '西暦から和暦に変換する'),
                m('p', '西暦年月日'),
                m('input[type=date]', {
                    oninput: e => {
                        ConvertAnnoToJP.date_ = e.target.value;
                    },
                    value: ConvertAnnoToJP.date_,
                }),
                m('input[type=button]', {
                    id: 'calc_jp',
                    value: '変換',
                    onclick: () => {
                        ConvertAnnoToJP.convert(ConvertAnnoToJP.date_)
                            .then(t => {
                                ConvertAnnoToJP.result_ = t;
                            })
                            .catch(e => console.log(e));
                    },
                }),
                m('div', { id: 'result_jp', style: { display: ConvertAnnoToJP.result_ === '' ? 'none' : 'block' } }, [
                    m('p', '和暦年月日'),
                    m('input[type=text][readonly]', ConvertAnnoToJP.result_),
                    m('input[type=button]', {
                        value: 'コピー',
                        onclick: () => CopyToClipboard(ConvertAnnoToJP.result_),
                    }),
                ]),
            ]),
        ]);
    },
};

const ConvertJPToAnno = {
    selectedEra_: '',
    inputedYear_: '',
    inputedMonth_: '',
    inputedDay_: '',
    result_: '',
    toTwoDigit_: val => (parseInt(val) < 10 ? '0' : '') + val,
    convert: async (era, year, month, day) => {
        const param = { date: era + year + '.' + month + '.' + day };
        const queryParam = new URLSearchParams(param);
        const r = await fetch('/api/anno_domini?' + queryParam).then(res => res.json());
        return r.year + '年' + r.month + '月' + r.day + '日';
    },
    view: () => {
        const ret = m('section', [
            m(CreateMenu('/convert_to_anno')),
            m('div.tabcontent', [
                m('h3', '和暦から西暦に変換する'),
                m('p', '和暦年月日'),
                m('p', [
                    m(
                        'select',
                        {
                            oncange: e => (ConvertJPToAnno.selectedEra_ = e.target.value),
                            value: ConvertJPToAnno.selectedEra_,
                        },
                        m(Era)
                    ),
                    m("input[type='number'][min='1'][max='64'][pattern='[1-9][0-9]*$']", {
                        oninput: e => (ConvertJPToAnno.inputedYear_ = ConvertJPToAnno.toTwoDigit_(e.target.value)),
                        value: ConvertJPToAnno.inputedYear_,
                    }),
                    '年',
                    m("input[type='number'][min='1'][max='12'][pattern='[1-9][0-9]*$']", {
                        oninput: e => (ConvertJPToAnno.inputedMonth_ = ConvertJPToAnno.toTwoDigit_(e.target.value)),
                        value: ConvertJPToAnno.inputedMonth_,
                    }),
                    '月',
                    m("input[type='number'][min='1'][max='31'][pattern='[1-9][0-9]*$']", {
                        oninput: e => (ConvertJPToAnno.inputedDay_ = ConvertJPToAnno.toTwoDigit_(e.target.value)),
                        value: ConvertJPToAnno.inputedDay_,
                    }),
                    '日',
                    m('input[type=button]', {
                        value: '変換',
                        onclick: () => {
                            ConvertJPToAnno.convert(
                                ConvertJPToAnno.selectedEra_,
                                ConvertJPToAnno.inputedYear_,
                                ConvertJPToAnno.inputedMonth_,
                                ConvertJPToAnno.inputedDay_
                            )
                                .then(t => {
                                    console.log(t);
                                    ConvertAnnoToJP.result_ = t;
                                })
                                .catch(e => console.log(e));
                        },
                    }),
                ]),
                m('div', { style: { display: ConvertAnnoToJP.result_ === '' ? 'none' : 'block' } }, [
                    m('p', '西暦年月日'),
                    m('input[type=text]', { value: ConvertJPToAnno.result_ }),
                    m('input[type=button]', {
                        value: 'コピー',
                        onclick: () => CopyToClipboard(ConvertJPToAnno.result_),
                    }),
                ]),
            ]),
        ]);
        ConvertJPToAnno.selectedEra_ = Era.eras[0];
        return ret;
    },
};

m.route(document.getElementById('content'), '/convert_to_jp', {
    '/convert_to_jp': ConvertAnnoToJP,
    '/convert_to_anno': ConvertJPToAnno,
});
