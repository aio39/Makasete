const Loading = () => {
  return (
    <div className="w-full flex flex-col items-center  py-14">
      <div
        // style="border-top-color:transparent"
        style={{ borderTopColor: 'transparent' }}
        className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin"
      ></div>
      <p className="mb-4`">단어 리스트를 생성중입니다.</p>
      <p className="mb-4">10초 정도 소요됩니다.</p>
    </div>
  );
};

export default Loading;
