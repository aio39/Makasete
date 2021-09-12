/* eslint-disable react-hooks/rules-of-hooks */
// let LoveIsComic_HTMLTemplate = (url) => {
//   return `
//       <!DOCTYPE html>
//       <html>
//         <head>
//            <title>Love Is Comic</title>
//         </head>
//         <body>
//           <img src="${url}"></img>
//         </body>
//       </html>`;
// };

const puppeteer = require('puppeteer');

// /**
//  * Responds to any HTTP request.
//  *
//  * @param {!express:Request} req HTTP request context.
//  * @param {!express:Response} res HTTP response context.
//  */
// exports.sendComic = (req, res) => {
//   const puppeteer = require('puppeteer');

//   function run() {
//     return new Promise(async (resolve, reject) => {
//       try {
//         const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
//         const page = await browser.newPage();
//         await page.goto('https://loveiscomix.com/random');
//         let imageurl = await page.evaluate(() => {
//           let item = document.querySelector(
//             '#primary > main > article > div > div.cellcomic > a > img'
//           );
//           return 'https://loveiscomix.com/' + item.getAttribute('src');
//         });
//         browser.close();
//         return resolve(imageurl);
//       } catch (e) {
//         return reject(e);
//       }
//     });
//   }

//   run()
//     .then((url) => {
//       console.log('Random LoveIs Comic from the following url: ' + url);
//       res.set('Content-Type', 'text/html');
//       res.status(200).send(LoveIsComic_HTMLTemplate(url));
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('An Error occured' + err);
//     });
// };

const JP_DICT_SEARCH = 'https://ja.dict.naver.com/#/search?query=';
const JP_DICT_ROOT = 'https://ja.dict.naver.com/';

const usePuppeteer = async (word) => {
  try {
    const PUPPETEER_OPTIONS = {
      args: [
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
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

exports.usePuppeteer = usePuppeteer;
