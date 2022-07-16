# 西暦・和暦変換サーバー

[![build](https://github.com/AinoMegumi/CalendarServer/actions/workflows/build.yml/badge.svg)](https://github.com/AinoMegumi/CalendarServer/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/AinoMegumi/CalendarServer/badge.svg?branch=renew_date_parser)](https://coveralls.io/github/AinoMegumi/CalendarServer?branch=renew_date_parser)


ＡＰＩリクエストで西暦から和暦、和暦から西暦に変換するサーバー

## 変換ＡＰＩ一覧

### ルート

https://calendar.net.meigetsu.jp/api

### /japanese

西暦を和暦に変換する。date パラメーターが無い時は今日の日付を使用する

#### パラメーター

| クエリパラメーター | 必須  | 説明                                                               | 例                     |
| ------------------ | ----- | ------------------------------------------------------------------ | ---------------------- |
| date               | false | 西暦年、月、日（区切りは任意）。<br>年は４桁、月と日は２桁で渡す。 | 20200401<br>2020.04.01 |

※年、月、日の間の区切りは「.」、「/」「-」のみ対応

#### レスポンス例

```json
{
    "jcalendar": "令和",
    "jalphabet": "R",
    "year": 2,
    "mon": 4,
    "day": 1
}
```

### /japanese/eras

API が対応している元号の一覧を取得します。

#### パラメーター

なし

#### レスポンス例

```json
{
    "eras": [
        { "alphabet": "M", "kanji": "明治" },
        { "alphabet": "T", "kanji": "大正" },
        { "alphabet": "S", "kanji": "昭和" },
        { "alphabet": "H", "kanji": "平成" },
        { "alphabet": "R", "kanji": "令和" }
    ]
}
```

### /japanese/border

指定された元号の開始年月日と終了年月日を返します。

#### パラメーター

| クエリパラメーター | 必須 | 説明                             | 例          |
| ------------------ | ---- | -------------------------------- | ----------- |
| era                | true | 元号（漢字またはアルファベット） | 平成, 平, H |

#### レスポンス例

```json
{
    "begin": {
        "japanese_year": 1,
        "anno_year": 1989,
        "month": 1,
        "day": 8
    },
    "end": {
        "japanese_year": 4,
        "anno_year": 2019,
        "month": 4,
        "day": 30
    }
}
```

### /anno_domini

和暦を西暦に変換する。date パラメーターが無い時は今日の日付を使用する。

#### パラメーター

| クエリパラメーター | 必須  | 説明                                                           | 例                                           |
| ------------------ | ----- | -------------------------------------------------------------- | -------------------------------------------- |
| date               | false | 元号、和暦年、月、日（区切りは任意）。<br>月と日は２桁で渡す。 | R10301<br>令和 10301<br>令 10301<br>R1.03.01 |

※年、月、日の間の区切りは「.」、「/」「-」のみ対応

#### レスポンス例

```json
{
    "year": 2019,
    "mon": 3,
    "day": 1
}
```

## ライセンス

Copyright 2021-2022 Meigetsu/Meigetsu Net. All rights reserved
