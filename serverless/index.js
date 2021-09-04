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
const sharp = require('sharp');

const papago = async (text) => {
  try {
    const result = await axios.post(
      'https://openapi.naver.com/v1/papago/n2mt',
      {
        source: 'ja',
        target: 'ko',
        text: text,
      },
      {
        headers: {
          'X-Naver-Client-Id': process.env.D2_ID,
          'X-Naver-Client-Secret': process.env.D2_SECRET,
        },
      }
    );
    console.log(result.data);
    return result.data.message.result.translatedText;
  } catch (error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    }
    return null;
  }
};

exports.ocr = (req, res) => {
  // NOTE  localhost:3000 설정.
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.set('Access-Control-Allow-Credentials', 'true');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Authorization');
  res.set('Access-Control-Max-Age', '3600');
  if (req.method !== 'POST') {
    // Return a "method not allowed" error
    return res.status(405).end();
  }
  const busboy = new Busboy({ headers: req.headers });
  const tmpdir = os.tmpdir();

  // This object will accumulate all the fields, keyed by their name
  const fields = {};

  // This object will accumulate all the uploaded files, keyed by their name.
  const uploads = {};

  let divide = 1;

  // This code will process each non-file field in the form.
  busboy.on('field', (fieldname, val, a, b, c, d) => {
    /**
     *  TODO(developer): Process submitted field values here
     */
    console.log(`Processed field ${fieldname}: ${val}.`);
    if (fieldname === 'divide') divide = parseInt(val);
    fields[fieldname] = val;
  });

  const fileWrites = [];
  const chunks = [];
  // This code will process each file uploaded.
  busboy.on('file', (fieldname, file, filename) => {
    // Note: os.tmpdir() points to an in-memory file system on GCF
    // Thus, any files in it must fit in the instance's memory.

    console.log(`Processed file ${filename}`);
    const filepath = path.join(tmpdir, filename);
    uploads[fieldname] = filepath;

    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    const promise = new Promise((resolve, reject) => {
      file.on('data', (data) => {
        chunks.push(data);
      });
      file.on('end', () => {
        writeStream.end();
      });
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });
    fileWrites.push(promise);
  });

  // Triggered once all uploaded files are processed by Busboy.
  // We still need to wait for the disk writes (saves) to complete.
  busboy.on('finish', async () => {
    await Promise.all(fileWrites);

    /**
     * TODO(developer): Process saved files here
     */
    console.log(chunks[0]);

    const client = new vision.ImageAnnotatorClient();
    const metadata = await sharp(chunks[0]).rotate().metadata();
    const crop = [];

    await Promise.all(
      Array(divide)
        .fill()
        .map(async (_, idx) => {
          crop[idx] = await sharp(chunks[0])
            .extract({
              left: 0,
              top: (metadata.height / divide) * (divide - (idx + 1)),
              height: metadata.height / divide,
              width: metadata.width,
            })
            .toBuffer();
        })
    );

    const detectedTextList = await Promise.all(
      crop.map((chunk) =>
        client
          .textDetection({
            image: {
              content: new Uint8Array(chunk),
            },
          })
          .catch((err) => {
            console.err(err);
          })
      )
    );

    for (const file in uploads) {
      console.log(uploads[file]);
      console.log(fileWrites);
      fs.unlinkSync(uploads[file]);
    }
    console.log(detectedTextList);

    const finalResult = [];
    await Promise.all(
      detectedTextList.map(async (chunk) => {
        const rawText = chunk[0].fullTextAnnotation.text;
        const kanjiText = rawText
          .replace(/[\w)(|]/gi, '') // 특수 문자 제거
          .replace(/\n/g, ' ') // 줄바꿈 제거
          .replace(/ +(?= )/g, '') // 2칸 이상 공백 제거
          .trim(); // 좌우 공백 제거

        const delimiter = '*';
        const papagoDelimiter = 'A';

        const kanjiTextWithDelimiter = kanjiText.replace(/( * )/g, delimiter);

        const [
          {
            data: { converted: hiraganaText },
          },
          hangulText,
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
          papago(kanjiText.replace(/( * )/g, papagoDelimiter)),
        ]);

        // 아래 trim() 끝자리 공백 제거
        const kanjiTextList = kanjiText.split(' ');
        const hiraganaTextList = hiraganaText
          .replace(/( * )+/g, '')
          .split(delimiter);
        const hangulTextList = hangulText
          ? hangulText.replace(/( * )/g, '').split(papagoDelimiter)
          : null;

        Array(kanjiTextList.length)
          .fill()
          .forEach((_, idx) => {
            finalResult.push([
              kanjiTextList[idx],
              hiraganaTextList[idx],
              ...(hangulTextList ? [hangulTextList[idx]] : []),
            ]);
          });
      })
    );

    res.send(finalResult);
  });

  busboy.end(req.rawBody);
};
