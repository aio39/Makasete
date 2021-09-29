// import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { FC } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { dbDictListQueryUpdate, indexedDBState } from '../recoil/atom';

const STORE = 'store1';

const Save: FC<{ idbKey: string; value: any }> = ({ idbKey: key, value }) => {
  const dbPromise = useRecoilValue(indexedDBState);
  const setDbDictListQueryUpdate = useSetRecoilState(dbDictListQueryUpdate);
  const a = useRecoilValue(dbDictListQueryUpdate);
  const handleSave = async () => {
    const db = await dbPromise;
    await db
      .put(STORE, value, key)
      .then((v) => {
        toast('단어 저장 성공');
        setDbDictListQueryUpdate((v) => !v);
      })
      .catch((err) => {
        console.error(err);
        toast('단어 저장 실패');
      });
  };

  return (
    <button className="p-3 bg-red-100" onClick={handleSave}>
      새로운 단어장 저장
      {a ? 'T' : 'F'}
    </button>
  );
};

export default Save;
