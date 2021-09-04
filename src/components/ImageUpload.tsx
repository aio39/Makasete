import axios from 'axios';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRecoilState } from 'recoil';
import { textState } from '../recoil/atom';

const ImageUpload = () => {
  const [Image, setImage] = useState<Object | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
  };
  const [text, setText] = useRecoilState(textState);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();

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
      const result = await axios.post('http://localhost:8080', params, {
        headers: {
          'content-type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      console.log(result);
    }

    console.log(e);
    console.log(Image);
  };

  return (
    <section>
      <div
        className=" h-40 border-2 px-4 py-6 border-mint  hover:bg-mint hover:text-white cursor-pointer "
        {...getRootProps({})}
      >
        <input
          {...getInputProps({
            id: 'wordImg',
            type: 'file',
            accept: 'image/*',
            alt: '분석할 단어 사진',
            onChange: handleUpload,
          })}
        />
        <label htmlFor="wordImg">분석할 사진</label>
        <p>드래그드랍 또는 클릭으로 단어 사진 업로드</p>
      </div>
      <ul>{files}</ul>
    </section>
  );
};

export default ImageUpload;
