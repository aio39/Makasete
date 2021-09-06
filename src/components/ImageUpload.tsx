import axios from 'axios';
import { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { textState } from '../recoil/atom';

const ImageUpload = () => {
  const uploadedImageRef = useRef<HTMLCanvasElement>(null);
  const [divideCount, setDivideCount] = useState('1');
  const setTextSate = useSetRecoilState(textState);
  const [Image, setImage] = useState<Object | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
  };
  const [text, setText] = useRecoilState(textState);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const imageUrl = reader.result;
        if (!uploadedImageRef.current) return;
        const canvas = uploadedImageRef.current;
        console.log(canvas);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        const pixelRatio = window.devicePixelRatio;

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';

        let img = new window.Image();

        // NOTE  반드시 image가 로드가 완료되고 나서 캔버스에 그려줘야한다.
        img.onload = () => {
          console.log(img);
          ctx.drawImage(img, 0, 0, 500, 500);
        };
        img.src = imageUrl as string;

        // console.log(binaryStr);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      const params = new FormData();
      params.append('image', e.target.files[0]);
      params.append('divide', divideCount);
      try {
        const result = await axios.post<string[][][]>(
          process.env.REACT_APP_OCR_URL as string,
          params,
          {
            headers: {
              'content-type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        console.log(result);
        setTextSate(result.data);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    }

    console.log(e);
    console.log(Image);
  };

  const handleDivideRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDivideCount(e.target.value);
  };
  console.log(process.env.development);
  return (
    <section className="w-full max-w-lg">
      <div
        className=" h-20  border-2 px-4 py-6  border-mint border-dashed  hover:bg-mint hover:text-white cursor-pointer "
        {...getRootProps({})}
      >
        <label htmlFor="wordImg">분석할 사진</label>
        <input
          {...getInputProps({
            id: 'wordImg',
            type: 'file',
            accept: 'image/*',
            alt: '분석할 단어 사진',
            onChange: handleUpload,
          })}
        />
        <p>드래그드랍 또는 클릭으로 단어 사진 업로드</p>
      </div>
      <div onChange={handleDivideRadio}>
        <input
          type="radio"
          name="divide"
          id="divide no"
          value="1"
          defaultChecked
          // checked={divideCount === '1'}
        />
        <label htmlFor="divideOne">원본</label>
        <input
          type="radio"
          name="divide"
          id="divide no"
          value="2"
          // checked={divideCount === '2'}
        />
        <label htmlFor="divideTwo">반으로 나누기</label>
      </div>
      <div>
        <canvas ref={uploadedImageRef} className="h-72 w-full " />
      </div>
      {process.env.development}
      <ul>{files}</ul>
      <div>
        <button type="button">크롭하기</button>
      </div>
    </section>
  );
};

export default ImageUpload;
