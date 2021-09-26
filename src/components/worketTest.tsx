import { createWorker } from 'tesseract.js';

const worker = createWorker({
  logger: (m) => console.log(m),
});

const Temp = () => {
  (async () => {
    await worker.load();
    await worker.loadLanguage('jpn');
    await worker.initialize('jpn');
    await worker.setParameters({
      //   tessedit_pageseg_mode: '1' as any,
      tessjs_create_box: '1',
      preserve_interword_spaces: '1', // 단어 사이 공백 제거
    });
    const {
      data: { text },
    } = await worker.recognize('http://localhost:3000/jp3.png');
    await worker.terminate();
  })();

  return <div>test</div>;
};

export default Temp;
