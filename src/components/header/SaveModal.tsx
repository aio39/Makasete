import { FC, MouseEventHandler, Suspense, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { STORE } from '../../const';
import {
  dbDictListQuery,
  dbDictListQueryUpdater,
  indexedDBState,
} from '../../recoil/dbAtom';
import { currWordListState } from '../../recoil/wordListAtom';
import Save from './Save';

const SavedList = () => {
  const loadedList = useRecoilValue(dbDictListQuery);
  const dbPromise = useRecoilValue(indexedDBState);
  const setTextState = useSetRecoilState(currWordListState);
  const setDbDictListQueryUpdate = useSetRecoilState(dbDictListQueryUpdater);

  const handler: MouseEventHandler<HTMLDivElement> = async (e) => {
    if (e.target instanceof HTMLButtonElement) {
      const { key, type } = e.target.dataset;
      if (!key || !type) return;
      const db = await dbPromise;
      if (type === 'load') {
        const data = await db.get(STORE, key);
        setTextState(data);
      }
      if (type === 'delete') {
        const data = await db.delete(STORE, key);
      }
      setDbDictListQueryUpdate((v) => !v);
    }
  };

  return (
    <>
      <div onClick={handler}>
        {loadedList
          ? loadedList.map((key) => (
              <li key={key as string}>
                {key}{' '}
                <button data-key={key} data-type="load">
                  불러오기
                </button>{' '}
                <button data-key={key} data-type="delete">
                  삭제하기
                </button>
              </li>
            ))
          : '저장된 단어가 없습니다.'}
      </div>
    </>
  );
};

export const SaveModal: FC<{}> = () => {
  const [newDictName, setNewDictName] = useState('');
  const nowWordList = useRecoilValue(currWordListState);
  return (
    <>
      <h2 className="text-4xl my-6  font-mono font-bold">불러오기</h2>
      <Suspense fallback={<div>loading</div>}>
        <SavedList />

        <input
          type="text"
          name="dictName"
          className="text-black"
          onChange={(e) => {
            setNewDictName(e.target.value);
          }}
          value={newDictName}
        />
        <Save idbKey={newDictName} value={nowWordList} />
      </Suspense>
    </>
  );
};
