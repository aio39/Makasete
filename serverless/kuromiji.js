const { rejects } = require('assert');
const kuromoji = require('kuromoji');

exports.runKuromoji = async ({ text }) => {
  const result = await new Promise((rel, rej) => {
    kuromoji
      .builder({ dicPath: 'node_modules/kuromoji/dict' })
      .build(function (err, tokenizer) {
        // tokenizer is ready
        if (err) rejects(err);
        const path = tokenizer.tokenize(text);
        rel(path);
      });
  });
  return result;
};
