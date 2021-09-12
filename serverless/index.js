/* eslint-disable react-hooks/rules-of-hooks */
const { memoryUsage } = require('process');

exports.test = async (request, response) => {
  const result = await Promise.resolve('ok');

  response.status(200).send(result);
};

exports.event = (event, callback) => {
  callback();
};

const vision = require('@google-cloud/vision');
const Busboy = require('busboy');
const axios = require('axios');

const path = require('path');
const os = require('os');
const fs = require('fs');

const { Translate } = require('@google-cloud/translate').v2;
const { runKuromoji } = require('./kuromiji');
const { usePuppeteer } = require('./crowlDict');
const translateByGCP = async (textList) => {
  const translate = new Translate({
    projectId: process.env.GCP_PROJECT || 'makasete',
  });
  const option = {
    from: 'ja',
    to: 'ko',
  };

  const [translation] = await translate.translate(textList, option);
  return translation;
};

const kanaToHira = (text) => {
  return text.replace(/[\u30a1-\u30f6]/g, function (match) {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
};

exports.ocr = (req, res) => {
  // NOTE  localhost:3000 설정.
  res.set(
    'Access-Control-Allow-Origin',
    process.env.HOST || 'http://localhost:3000'
  );
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Authorization');
  res.set('Access-Control-Max-Age', '3600');
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const MODE = 'mode';
  const IMAGE = 'image';

  let mode = 0; // 0 단어, 1 문장
  let imageData;

  //  const fields = {};
  const uploads = {};
  const result = [];
  const fileWritePromises = [];

  const busboy = new Busboy({ headers: req.headers });
  // not File 필드 값들을 string으로 배열에 넣음.
  busboy.on('field', (fieldName, val, a, b, c, d) => {
    if (fieldName === MODE && val === '1') mode = 1;
  });

  const tmpdir = os.tmpdir();
  busboy.on('file', (fieldName, file, fileName) => {
    const filepath = path.join(tmpdir, fileName); // 메모리상 dir
    uploads[fieldName] = filepath;
    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    const promise = new Promise((resolve, reject) => {
      file.on('data', (data) => {
        imageData = data;
      });
      file.on('end', () => {
        writeStream.end();
      });
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    fileWritePromises.push(promise);
  });

  busboy.on('finish', async () => {
    for (const file in uploads) {
      fs.unlinkSync(uploads[file]);
    }

    await Promise.all(fileWritePromises);

    const client = new vision.ImageAnnotatorClient();
    const detectedText = await client
      .textDetection({
        image: {
          content: new Uint8Array(imageData),
        },
      })
      .catch((err) => {
        console.err(err);
      })
      .finally(() => {
        imageData = null;
      });

    const rawText = detectedText[0].fullTextAnnotation.text;

    if (mode === 0) {
      const kanjiText = rawText
        .replace(/[\w)(|]/gi, '') // 특수 문자 제거
        .replace(/\n/g, ' ') // 줄바꿈 제거
        .replace(/ +(?= )/g, '') // 2칸 이상 공백 제거
        .trim(); // 좌우 공백 제거

      const delimiter = '*';
      const kanjiTextList = kanjiText.split(' ');

      const [
        {
          data: { converted: hiraganaText },
        },
        hangulTextList,
      ] = await Promise.all([
        axios
          .post('https://labs.goo.ne.jp/api/hiragana', {
            app_id:
              '5f82101255bc786575ef667938d33a5f8afccc2e54aa4638dd81230aa06c26e8',
            sentence: kanjiText.replace(/( * )/g, delimiter),
            output_type: 'hiragana',
          })
          .catch((err) => {
            console.log(err);
          }),
        translateByGCP(kanjiText.replace(/ /g, '。 ').split(' ')),
      ]);

      const hiraganaTextList = hiraganaText
        .replace(/( * )+/g, '')
        .split(delimiter);

      Array(kanjiTextList.length)
        .fill()
        .forEach((_, idx) => {
          result.push([
            kanjiTextList[idx],
            hiraganaTextList[idx],
            ...(hangulTextList ? [hangulTextList[idx].slice(0, -1)] : []),
          ]);
        });
      console.log(memoryUsage());
      res.send(result);
    } else {
      const posList = {
        名詞: '名詞', //
        動詞: '動詞', //
        副詞: '副詞', //
        助動詞: '助動詞', // た　ない　な
        接続詞: '接続詞', // すなわち
        助詞: '助詞', //  の　と　は
        記号: '記号', // 공백 ， ） 。
      };
      const kuroResult = await runKuromoji({
        text: rawText.replace(/\n/g, ' '),
      });
      const hiraganaTextList = [];
      const kanjiTextList = [];
      kuroResult.forEach((curr) => {
        const { pos, basic_form, reading, conjugated_form, conjugated_type } =
          curr;
        if ([posList.記号, posList.助動詞, posList.助詞].includes(pos)) return;
        if (basic_form === '*') return;
        if (
          ['連用形'].includes(conjugated_form) &&
          ['サ変・スル'].includes(conjugated_type)
        )
          return; // ~시 필터링
        if (
          [
            'せる',
            'すぎる',
            'みる',
            'いる',
            'れる',
            'られる',
            'できる',
            'くれる',
            'ささげる',
            'わけ',
            'こと',
            'もの',
            'こと',
            'なら',
          ].includes(basic_form)
        )
          return;
        hiraganaTextList.push(kanaToHira(reading));
        kanjiTextList.push(basic_form);
      });

      const hangulTextList = await translateByGCP(kanjiTextList);

      Array(kanjiTextList.length)
        .fill()
        .forEach((_, idx) => {
          result.push([
            kanjiTextList[idx],
            hiraganaTextList[idx],
            ...(hangulTextList ? [hangulTextList[idx]] : []),
          ]);
        });
      console.log(memoryUsage());
      res.send(result);
    }
  });
  busboy.end(req.rawBody);
};

exports.dict = (req, res) => {
  res.set(
    'Access-Control-Allow-Origin',
    process.env.HOST || 'http://localhost:3000'
  );
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Authorization');
  res.set('Access-Control-Max-Age', '3600');
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  usePuppeteer(req.query.word)
    .then((r) => {
      res.send(r);
    })
    .catch((e) => {
      res.send(e);
    });
};
