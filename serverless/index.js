exports.helloWorld = async (request, response) => {
  const result = await Promise.resolve('ok');
  response.status(200).send(result);
};

exports.event = (event, callback) => {
  callback();
};

const vision = require('@google-cloud/vision');
const Busboy = require('busboy');

exports.ocr = async (req, res) => {
  console.log(req.headers);
  const fields = {};

  const bb = new Busboy({ headers: req.headers });

  await new Promise((resolve, reject) => {
    bb.on('field', (fieldname, val) => {
      /**
       *  TODO(developer): Process submitted field values here
       */
      console.log(`Processed field ${fieldname}: ${val}.`);
      fields[fieldname] = val;
    }).on('finish', resolve);
    bb.end(req.headers);
  });

  console.log(fields.img);

  const client = new vision.ImageAnnotatorClient();
  try {
    const [result] = await client.textDetection(
      'https://www.researchgate.net/profile/Victoria-Yaneva/publication/330117253/figure/tbl7/AS:711057735700480@1546540783264/1-Examples-of-easy-and-difficult-sentences-from-Laufer-and-Nations.png'
    );
    const detections = result.textAnnotations;
    res.status(200).send(detections);
  } catch (error) {
    res.status(404).send(error);
  }
};

const parse = require('await-busboy');

const parsingFrom = (req) => {
  const busboy = new Busboy({ headers: req.headers });
  const fields = [];
  console.log(fields);
  return new Promise((res, rej) => {
    busboy.on('file', (fieldname, file, filename) => {
      // Note: os.tmpdir() points to an in-memory file system on GCF
      // Thus, any files in it must fit in the instance's memory.

      console.log(file);
      fields.push(file);
      res(file);
    });
    // busboy.on('error', (err) => {
    //   console.error(err);
    // });
    // busboy.on('finish', () => {
    //   console.log('finish');
    //   res(fields);
    // });
  });
};

exports.ocr3 = async (req, res) => {
  const result = await parsingFrom(req).catch((err) => {
    console.log(err);
  });
  console.log('here');
  res.status(200).send(result);
};

const path = require('path');
const os = require('os');
const fs = require('fs');

// Node.js doesn't have a built-in multipart/form-data parsing library.
// Instead, we can use the 'busboy' library from NPM to parse these requests.

exports.ocr2 = (req, res) => {
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
    const [result] = await client.textDetection(chunks[0]);
    for (const file in uploads) {
      console.log(uploads[file]);
      console.log(fileWrites);
      fs.unlinkSync(uploads[file]);
    }
    res.send(result);
  });

  busboy.end(req.rawBody);
};
