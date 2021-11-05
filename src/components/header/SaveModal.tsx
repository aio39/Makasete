import { FC, MouseEventHandler, Suspense, useState } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { STORE } from '../../const';
import {
  dbDictListQuery,
  dbDictListQueryUpdater,
  indexedDBState,
} from '../../recoil/dbAtom';
import { currWordListState } from '../../recoil/wordListAtom';
import SaveWordListBtn from './Save';

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
        if (data) {
          setTextState(data);
          toast('불러오기 성공');
        } else {
          toast('불러오기 실패');
        }
      }
      if (type === 'delete') {
        await db.delete(STORE, key);
        toast('삭제 성공');
      }
      setDbDictListQueryUpdate((v) => !v);
    }
  };

  return (
    <>
      <div onClick={handler} className="w-full">
        {loadedList ? (
          loadedList.map((key) => (
            <li
              key={key as string}
              className="list-none w-full flex justify-start cursor-pointer hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2 flex-wrap md:flex-nowrap "
            >
              <span className="bg-mint h-2 w-2 m-2 rounded-full flex-shrink-0"></span>
              <span className="font-medium px-2 text-lg  break-all">{key}</span>
              <div className="flex-grow   w-full md:w-auto"></div>
              <div className="text-sm font-normal  tracking-wide flex-shrink-0  ml-4  my-2  md:ml-0 md:my-0  ">
                <button
                  data-key={key}
                  data-type="load"
                  className="bg-mint px-4 py-2 rounded-sm mr-2"
                >
                  불러오기
                </button>
                <button
                  data-key={key}
                  data-type="delete"
                  className="bg-red-500 px-4 py-2 rounded-sm mr-2"
                >
                  삭제하기
                </button>
              </div>
            </li>
          ))
        ) : (
          <div className="flex justify-center my-6">
            저장된 단어가 없습니다.
          </div>
        )}
      </div>
    </>
  );
};

export const SaveModal: FC<{}> = () => {
  const [newDictName, setNewDictName] = useState('');
  const nowWordList = useRecoilValue(currWordListState);
  return (
    <>
      <h2 className="text-4xl my-6  font-mono font-bold">저장된 데이터</h2>
      <Suspense fallback={<div>loading</div>}>
        <SavedList />
        <div className="border-b-2 border-gray-600 w-full my-4"></div>
        <input
          type="text"
          name="dictName"
          className="text-black placeholder-opacity-60 w-4/5"
          onChange={(e) => {
            setNewDictName(e.target.value);
          }}
          placeholder="단어장 이름"
          value={newDictName}
        />
        <SaveWordListBtn idbKey={newDictName} value={nowWordList} />
      </Suspense>
    </>
  );
};
