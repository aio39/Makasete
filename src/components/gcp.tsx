import vision from '@google-cloud/vision';
import { useEffect } from 'react';

const CloudVisionTest = () => {
  const client = new vision.ImageAnnotatorClient({});

  useEffect(() => {
    async function test() {
      const [result] = await client.textDetection(
        `http://localhost:3000/jp3.png`
      );
      //   const [result] = await client.batchAnnotateImages({})
      console.log(result);
      const labels = result;
    }

    test();
  }, []);

  return <div></div>;
};

export default CloudVisionTest;
