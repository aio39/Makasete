exports.runKuromoji = async ({ text }) => {
  const kuromoji = require('kuromoji');
  const result = await new Promise((rel, rej) => {
    kuromoji
      .builder({ dicPath: 'node_modules/kuromoji/dict' })
      .build(function (err, tokenizer) {
        // tokenizer is ready
        if (err) rej(err);
        const path = tokenizer.tokenize(text);
        rel(path);
      });
  });
  return result;
};
