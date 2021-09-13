function removeOneItemFromArray<T>(arr: Array<T>, idx: number): Array<T> {
  const copyArray = [...arr];
  copyArray.splice(idx, 1);
  return copyArray;
}

export default removeOneItemFromArray;
