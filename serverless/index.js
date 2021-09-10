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
const translate = async (textList) => {
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
  const busboy = new Busboy({ headers: req.headers });

  const fields = {};
  const uploads = {};
  // not File 필드 string 값
  busboy.on('field', (fieldname, val, a, b, c, d) => {
    fields[fieldname] = val;
  });

  const tmpdir = os.tmpdir();
  const fileWritePromises = [];
  let imageData;
  busboy.on('file', (fieldname, file, filename) => {
    const filepath = path.join(tmpdir, filename); // 메모리상 dir
    uploads[fieldname] = filepath;
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

  // Triggered once all uploaded files are processed by Busboy.
  // We still need to wait for the disk writes (saves) to complete.
  const result = [];
  busboy.on('finish', async () => {
    for (const file in uploads) {
      fs.unlinkSync(uploads[file]);
    }

    await Promise.all(fileWritePromises);
    /**
     * TODO(developer): Process saved files here
     */
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
      translate(kanjiText.replace(/ /g, '。 ').split(' ')),
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
  });

  busboy.end(req.rawBody);
};
