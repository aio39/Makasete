onmessage = ({ data }) => {
  console.log(data);
  postMessage('world');
};
