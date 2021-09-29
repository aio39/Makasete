import { useRecoilValue } from 'recoil';
import { currWordListLengthQuery } from '../../../recoil/wordListAtom';

const WordListNav = () => {
  const length = useRecoilValue(currWordListLengthQuery);

  return (
    <div className="sticky max-w-min bg-mint bg-opacity-30 flex justify-center mx-auto bottom-4 py-2 px-4 my-4 rounded-md">
      {Array(length)
        .fill('')
        .map((_, idx) => (
          <div
            key={`page${idx + 1}`}
            className="hover:text-mint cursor-pointer mx-2"
          >
            <a href={`#list${idx + 1}`} className="text-lg ">
              {idx + 1}
            </a>
          </div>
        ))}
    </div>
  );
};

export default WordListNav;
