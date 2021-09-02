import axios from 'axios';
import { useState } from 'react';

const ImageUpload = () => {
  const [Image, setImage] = useState<Object | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e);
  };

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
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="wordImg">분석할 사진</label>
        <input
          id="wordImg"
          type="file"
          accept="image/*"
          alt="분석할 단어 사진"
          onChange={handleUpload}
        />
        <button type="submit">제출</button>
      </form>
    </div>
  );
};

export default ImageUpload;
