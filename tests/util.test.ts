import { expect } from 'chai';
import { fixedUnshift, makeFilledArray } from '../src/ts/util';


describe('Util', (): void => {
  describe('Unshift', (): void => {
    const testArray = [6, 2, 3];
    Object.seal(testArray);
    it('should insert 1 at begining of [6,2,3] array',
      (): void => {
        expect(fixedUnshift(testArray, 1)).to.eql([1, 6, 2]);
      });
  });
  describe('Test splice on sealed array', (): void => {
    const testArray = [1, 2, null, 4];
    Object.seal(testArray);
    it('should insert 3 in sorted order',
      (): void => {
        testArray.splice(2, 1, 3)
        expect(testArray).to.eql([1, 2, 3, 4]);
      });
  });
  describe('Test make filled array', (): void => {
    const testArray = [null, null, null, null];
    Object.seal(testArray);
    it('should make a array of 4 null elements',
      (): void => {
        expect(makeFilledArray(null, 4)).to.eql(testArray);
      });
  });
});

