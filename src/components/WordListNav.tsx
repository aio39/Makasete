import { useRecoilValue } from 'recoil';
import { wordListLength } from '../recoil/atom';

const WordListNav = () => {
  const length = useRecoilValue(wordListLength);

  return (
    <div className="sticky max-w-min bg-gray-400 flex justify-center gap-4 mx-auto bottom-4 py-2 px-4 my-2">
      {Array(length)
        .fill('')
        .map((_, idx) => (
          <div
            key={`page${idx + 1}`}
            className="hover:text-mint cursor-pointer "
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
