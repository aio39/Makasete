// import { openDB, deleteDB, wrap, unwrap } from 'idb';
import { FC } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { STORE } from '../../const';
import { dbDictListQueryUpdater, indexedDBState } from '../../recoil/dbAtom';

const SaveWordListBtn: FC<{ idbKey: string; value: any }> = ({
  idbKey: key,
  value,
}) => {
  const dbPromise = useRecoilValue(indexedDBState);
  const setDbDictListQueryUpdate = useSetRecoilState(dbDictListQueryUpdater);
  const handleSave = async () => {
    console.log('aaaaa');
    if (key.length === 0) return;
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
    <button
      className={key.length ? 'btn-active' : 'btn-inactive'}
      onClick={handleSave}
      disabled={key.length === 0 ? true : false}
    >
      새로운 단어장 저장
    </button>
  );
};

export default SaveWordListBtn;
