exports.helloWorld = async (request, response) => {
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

exports.ocr2 = (req, res) => {
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

  // This code will process each non-file field in the form.
  busboy.on('field', (fieldname, val) => {
    /**
     *  TODO(developer): Process submitted field values here
     */
    console.log(`Processed field ${fieldname}: ${val}.`);
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
    const requests = [{}];

    const [result] = await client
      .textDetection({
        image: {
          content: new Uint8Array(chunks[0]),
        },
      })
      .catch((err) => {
        console.err(err);
      });
    for (const file in uploads) {
      console.log(uploads[file]);
      console.log(fileWrites);
      fs.unlinkSync(uploads[file]);
    }
    const text = result.fullTextAnnotation.text;
    const splittedText = text.replace(/[\w)|]/gi, '');

    const { data } = await axios
      .post('https://labs.goo.ne.jp/api/hiragana', {
        app_id:
          '5f82101255bc786575ef667938d33a5f8afccc2e54aa4638dd81230aa06c26e8',
        sentence: splittedText,
        output_type: 'hiragana',
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(data);

    const data2 = data.converted.split('  ').reduce((acu, cur) => {
      const trim = cur.trim();
      if (trim !== '') acu.push(trim);
      return acu;
    }, []);
    res.send(data2);
  });

  busboy.end(req.rawBody);
};
