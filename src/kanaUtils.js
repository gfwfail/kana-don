// kanaUtils.js
export const kanaGroups = {
    hiragana: {
        a: [
            { kana: 'あ', romaji: 'a' },
            { kana: 'い', romaji: 'i' },
            { kana: 'う', romaji: 'u' },
            { kana: 'え', romaji: 'e' },
            { kana: 'お', romaji: 'o' }
        ],
        ka: [
            { kana: 'か', romaji: 'ka' },
            { kana: 'き', romaji: 'ki' },
            { kana: 'く', romaji: 'ku' },
            { kana: 'け', romaji: 'ke' },
            { kana: 'こ', romaji: 'ko' }
        ],
        sa: [
            { kana: 'さ', romaji: 'sa' },
            { kana: 'し', romaji: 'shi' },
            { kana: 'す', romaji: 'su' },
            { kana: 'せ', romaji: 'se' },
            { kana: 'そ', romaji: 'so' }
        ],
        ta: [
            { kana: 'た', romaji: 'ta' },
            { kana: 'ち', romaji: 'chi' },
            { kana: 'つ', romaji: 'tsu' },
            { kana: 'て', romaji: 'te' },
            { kana: 'と', romaji: 'to' }
        ],
        na: [
            { kana: 'な', romaji: 'na' },
            { kana: 'に', romaji: 'ni' },
            { kana: 'ぬ', romaji: 'nu' },
            { kana: 'ね', romaji: 'ne' },
            { kana: 'の', romaji: 'no' }
        ],
        ha: [
            { kana: 'は', romaji: 'ha' },
            { kana: 'ひ', romaji: 'hi' },
            { kana: 'ふ', romaji: 'fu' },
            { kana: 'へ', romaji: 'he' },
            { kana: 'ほ', romaji: 'ho' }
        ],
        ma: [
            { kana: 'ま', romaji: 'ma' },
            { kana: 'み', romaji: 'mi' },
            { kana: 'む', romaji: 'mu' },
            { kana: 'め', romaji: 'me' },
            { kana: 'も', romaji: 'mo' }
        ],
        ya: [
            { kana: 'や', romaji: 'ya' },
            { kana: 'ゆ', romaji: 'yu' },
            { kana: 'よ', romaji: 'yo' }
        ],
        ra: [
            { kana: 'ら', romaji: 'ra' },
            { kana: 'り', romaji: 'ri' },
            { kana: 'る', romaji: 'ru' },
            { kana: 'れ', romaji: 're' },
            { kana: 'ろ', romaji: 'ro' }
        ],
        wa: [
            { kana: 'わ', romaji: 'wa' },
            { kana: 'を', romaji: 'wo' },
            { kana: 'ん', romaji: 'n' }
        ]
    },
    katakana: {
        a: [
            { kana: 'ア', romaji: 'a' },
            { kana: 'イ', romaji: 'i' },
            { kana: 'ウ', romaji: 'u' },
            { kana: 'エ', romaji: 'e' },
            { kana: 'オ', romaji: 'o' }
        ],
        ka: [
            { kana: 'カ', romaji: 'ka' },
            { kana: 'キ', romaji: 'ki' },
            { kana: 'ク', romaji: 'ku' },
            { kana: 'ケ', romaji: 'ke' },
            { kana: 'コ', romaji: 'ko' }
        ],
        sa: [
            { kana: 'サ', romaji: 'sa' },
            { kana: 'シ', romaji: 'shi' },
            { kana: 'ス', romaji: 'su' },
            { kana: 'セ', romaji: 'se' },
            { kana: 'ソ', romaji: 'so' }
        ],
        ta: [
            { kana: 'タ', romaji: 'ta' },
            { kana: 'チ', romaji: 'chi' },
            { kana: 'ツ', romaji: 'tsu' },
            { kana: 'テ', romaji: 'te' },
            { kana: 'ト', romaji: 'to' }
        ],
        na: [
            { kana: 'ナ', romaji: 'na' },
            { kana: 'ニ', romaji: 'ni' },
            { kana: 'ヌ', romaji: 'nu' },
            { kana: 'ネ', romaji: 'ne' },
            { kana: 'ノ', romaji: 'no' }
        ],
        ha: [
            { kana: 'ハ', romaji: 'ha' },
            { kana: 'ヒ', romaji: 'hi' },
            { kana: 'フ', romaji: 'fu' },
            { kana: 'ヘ', romaji: 'he' },
            { kana: 'ホ', romaji: 'ho' }
        ],
        ma: [
            { kana: 'マ', romaji: 'ma' },
            { kana: 'ミ', romaji: 'mi' },
            { kana: 'ム', romaji: 'mu' },
            { kana: 'メ', romaji: 'me' },
            { kana: 'モ', romaji: 'mo' }
        ],
        ya: [
            { kana: 'ヤ', romaji: 'ya' },
            { kana: 'ユ', romaji: 'yu' },
            { kana: 'ヨ', romaji: 'yo' }
        ],
        ra: [
            { kana: 'ラ', romaji: 'ra' },
            { kana: 'リ', romaji: 'ri' },
            { kana: 'ル', romaji: 'ru' },
            { kana: 'レ', romaji: 're' },
            { kana: 'ロ', romaji: 'ro' }
        ],
        wa: [
            { kana: 'ワ', romaji: 'wa' },
            { kana: 'ヲ', romaji: 'wo' },
            { kana: 'ン', romaji: 'n' }
        ]
    }
};

export const getRandomKana = (selectedTypes, selectedGroups) => {
    const allKana = selectedTypes.flatMap(type =>
        selectedGroups.flatMap(group => kanaGroups[type][group])
    );
    const randomIndex = Math.floor(Math.random() * allKana.length);
    return allKana[randomIndex];
};