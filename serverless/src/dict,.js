/* eslint-disable react-hooks/rules-of-hooks */
const JP_DICT_SEARCH = 'https://ja.dict.naver.com/#/search?query=';
const JP_DICT_ROOT = 'https://ja.dict.naver.com/';
const puppeteer = require('puppeteer');

const usePuppeteer = async (word) => {
  try {
    const args =
      process.env.MODE === 'dev'
        ? [
            '--ignore-certificate-errors',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
          ]
        : [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '-–disable-dev-shm-usage',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
          ];

    const PUPPETEER_OPTIONS = {
      args,
      headless: true,
      timeout: 4000,
    };
    const browser = await puppeteer.launch(PUPPETEER_OPTIONS);
    const page = await browser.newPage();
    await page.goto(encodeURI(JP_DICT_SEARCH + word));

    await page.waitForSelector('div');
    // Get the "viewport" of the page, as reported by the page.
    const wordPageUrl = await page.evaluate(() => {
      return document
        .querySelector('#searchPage_entry  .origin > a')
        .getAttribute('href');
    });

    console.log('wordPageUrl:', wordPageUrl);

    await page.goto(JP_DICT_ROOT + wordPageUrl, {
      waitUntil: 'domcontentloaded',
    });

    await page.waitForSelector('.mean_tray');
    await page.waitForSelector('li.mean_item.my_mean_item');

    const result = await page.evaluate(() => {
      //   return document.querySelector('.mean_tray').innerHTML;
      const meanList = document.querySelector(
        'li.mean_item.my_mean_item'
      ).innerHTML;
      console.log(meanList);

      //   const crawlingList = meanList.map((node) => {
      //     const mean = node.querySelector('.mean_desc span.mean').innerText;
      //     const exampleDivList = node.querySelectorAll('.example_item');
      //     const detailMean = exampleDivList.map((node) => {
      //       const koreanMean = node.querySelector(
      //         'p.translate span.text'
      //       ).innerText;
      //       return [koreanMean];
      //     });

      //     return { mean, detailMean };
      //   });
      return meanList;
      //   return crawlingList;
    });

    console.log(result);

    await browser.close();
    return result;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

exports.dict = async (req, res) => {
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
