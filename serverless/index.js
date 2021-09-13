/* eslint-disable react-hooks/rules-of-hooks */

const { dict } = require('./src/dict,.js');
const { ocr } = require('./src/ocr.js');

exports.test = async (request, response) => {
  const result = await Promise.resolve('ok');

  response.status(200).send(result);
};

exports.ocr = ocr;
exports.dict = dict;
