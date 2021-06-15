export function zip(arrays: any[][]): any[] {
  return arrays[0].map(function(_, i) {
    return arrays.map(function(array) { return array[i] })
  });
}

/* like unshift but for a fixed length array */
export function fixedUnshift(arr: any[], value: number): any[] {
  let nextElement: number = 0;
  for (let i = 0; i < arr.length; i++) {
    if (i == 0) {
      nextElement = arr[i]
      arr[i] = value;
    } else {
      let tmp = arr[i]
      arr[i] = nextElement;
      nextElement = tmp;
    }
  }
  return arr;
}

/* make an array of N elements */
export function makeFilledArray<ElementType>(element: ElementType, length: number): ElementType[] {
  let returnArray = [];

  for (let i = 0; i < length; i++) {
    returnArray.push(element);
  }
  return returnArray;
}
