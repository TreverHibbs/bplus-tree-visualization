import { BPlusTreeFactory, BPlusTreeRoot, algoStepTypeEnum } from '../src/ts/bPlusTreeAlgo';
import { expect } from 'chai';

describe('BPlusTree', (): void => {
  const myBplusTree = BPlusTreeFactory(2);
  describe('BPlusTreeFactory', () => { // the tests container
    it('should return BPlusTree object with null root and maxChildren set',
      (): void => {
        expect(myBplusTree).to.include({ maxChildren: 2 });
      });
  });

  describe('BPlusTree find func', (): void => {
    const myFindBPlusTree = BPlusTreeFactory(2);
    const myFindBPlusTreeRoot = {
      isLeafNode: false,
      keys: [3, 4],
      pointers: [
        { isLeafNode: true, keys: [2], pointers: [] },
        { isLeafNode: true, keys: [3], pointers: [] },
        { isLeafNode: true, keys: [4, 6], pointers: [] }
      ]
    };
    myFindBPlusTree.setRoot(myFindBPlusTreeRoot);
    const Find6Obj = myFindBPlusTree.find(6);
    const Find2Obj = myFindBPlusTree.find(2);
    const Find3Obj = myFindBPlusTree.find(3);
    const Find4Obj = myFindBPlusTree.find(4);
    const Find10Obj = myFindBPlusTree.find(10);

    it('should successfully find the numbers 6, 2, 3, and 4 in the tree',
      (): void => {
        expect(Find6Obj).to.eql({ node: { isLeafNode: true, keys: [4, 6], pointers: [] }, foundFlag: true });
        expect(Find2Obj).to.eql({ node: { isLeafNode: true, keys: [2], pointers: [] }, foundFlag: true });
        expect(Find3Obj).to.eql({ node: { isLeafNode: true, keys: [3], pointers: [] }, foundFlag: true });
        expect(Find4Obj).to.eql({ node: { isLeafNode: true, keys: [4, 6], pointers: [] }, foundFlag: true });
      });
    it('should fail to find number 10',
      (): void => {
        expect(Find10Obj).to.eql({ node: { isLeafNode: true, keys: [4, 6], pointers: [] }, foundFlag: false });
      });
    it('should insert the correct steps into the algo step queue',
      (): void => {
        expect(myFindBPlusTree.getAlgoStepQueue()).to.eql(
          [
            { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 2 },
            { type: algoStepTypeEnum.Found, foundElementIndex: 1 },
            { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
            { type: algoStepTypeEnum.Found, foundElementIndex: 0 },
            { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
            { type: algoStepTypeEnum.Found, foundElementIndex: 0 },
            { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 2 },
            { type: algoStepTypeEnum.Found, foundElementIndex: 0 },
            { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 2 },
            { type: algoStepTypeEnum.NotFound }
          ]
        );
      });
  });

  describe('BPlusTree insert func', (): void => {
    myBplusTree.insert(2);
    it('should initialize the root when first number is inserted',
      (): void => {
        expect(myBplusTree.getRoot()).to.not.be.a('null');
        expect(myBplusTree.getRoot()).to.have.property('keys').eql([2]);
        expect(myBplusTree.getRoot()).to.have.property('pointers').eql([]);
        expect(myBplusTree.getRoot()).to.have.property('isLeafNode').eql(true);
      });

    let numbersToInsert = [3, 4, 6];
    for (let num of numbersToInsert) {
      myBplusTree.insert(num);
    }
    it('should insert series of numbers',
      (): void => {
        expect(myBplusTree.getRoot()).to.eql({
          isLeafNode: false,
          keys: [3, 4],
          pointers: [
            { isLeafNode: true, keys: [2], pointers: [] },
            { isLeafNode: true, keys: [3], pointers: [] },
            { isLeafNode: true, keys: [4, 6], pointers: [] }
          ]
        });
      });
    for (let num of [10, 11, 15]) {
      myBplusTree.insert(num);
    }

    it('should insert bigger series of numbers',
      (): void => {
        expect(myBplusTree.getRoot()).to.eql({
          isLeafNode: false,
          keys: [4, 10],
          pointers: [
            {
              isLeafNode: false,
              keys: [3],
              pointers: [
                {
                  isLeafNode: true,
                  keys: [2],
                  pointers: []
                },
                {
                  isLeafNode: true,
                  keys: [3],
                  pointers: []
                }
              ]
            },
            {
              isLeafNode: false,
              keys: [6],
              pointers: [
                {
                  isLeafNode: true,
                  keys: [4],
                  pointers: []
                },
                {
                  isLeafNode: true,
                  keys: [6],
                  pointers: []
                }
              ]
            },
            {
              isLeafNode: false,
              keys: [11],
              pointers: [
                {
                  isLeafNode: true,
                  keys: [10],
                  pointers: []
                },
                {
                  isLeafNode: true,
                  keys: [11, 15],
                  pointers: []
                }
              ]
            }
          ]
        });
      });

    it('should insert series of numbers with n = 3',
      (): void => {
        const myN3Tree = BPlusTreeFactory(3);
        let numbersToInsert = [2, 5, 10, 4];
        for (let num of numbersToInsert) {
          myN3Tree.insert(num);
        }
        expect(myN3Tree.getRoot()).to.eql({
          isLeafNode: false,
          keys: [5],
          pointers: [
            { isLeafNode: true, keys: [2, 4], pointers: [] },
            { isLeafNode: true, keys: [5, 10], pointers: [] },
          ]
        });
      });
  });
});
