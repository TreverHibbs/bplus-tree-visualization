import {
  BPlusTreeFactory,
  BPlusTreeRoot,
  algoStepTypeEnum,
  algoQueueElement,
  findReturnType,
} from '../src/ts/bPlusTreeAlgo';
import { expect } from 'chai';
import { zip } from '../src/ts/util';

describe('BPlusTree', (): void => {
  /* initialize big B+tree for testing */
  const bigBPlusTree = {
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
  };
  const smallBPlusTree = {
    isLeafNode: false,
    keys: [3, 4],
    pointers: [
      { isLeafNode: true, keys: [2], pointers: [] },
      { isLeafNode: true, keys: [3], pointers: [] },
      { isLeafNode: true, keys: [4, 6], pointers: [] }
    ]
  };
  const runFindTest = (treeRoot: BPlusTreeRoot,
    treeDegree: number,
    testNumbers: number[],): { returnValues: findReturnType[], queue: algoQueueElement[] } => {
    const myFindBPlusTree = BPlusTreeFactory(treeDegree);
    myFindBPlusTree.setRoot(treeRoot);

    const returnValues: findReturnType[] = [];
    for (let value of testNumbers) {
      returnValues.push(myFindBPlusTree.find(value));
    }
    return { returnValues, queue: myFindBPlusTree.getAlgoStepQueue() };
  }


  const myBplusTree = BPlusTreeFactory(2);
  describe('BPlusTreeFactory', () => { // the tests container
    it('should return BPlusTree object with null root and maxChildren set',
      (): void => {
        expect(myBplusTree).to.include({ maxChildren: 2 });
      });
  });

  describe('BPlusTree find func', (): void => {
    describe('test on small b+tree', (): void => {
      const { returnValues: actualReturnValues, queue: algoStepQueue } = runFindTest(smallBPlusTree, 2, [6, 2, 3, 4, 10]);
      const expectedReturnValues = [
        { node: { isLeafNode: true, keys: [4, 6], pointers: [] }, foundFlag: true },
        { node: { isLeafNode: true, keys: [2], pointers: [] }, foundFlag: true },
        { node: { isLeafNode: true, keys: [3], pointers: [] }, foundFlag: true },
        { node: { isLeafNode: true, keys: [4, 6], pointers: [] }, foundFlag: true },
        { node: { isLeafNode: true, keys: [4, 6], pointers: [] }, foundFlag: false },
      ];
      const returnAndExpectedValues = zip([actualReturnValues, expectedReturnValues]);
      it('should successfully find the numbers 6, 2, 3, and 4 and fail to find 10',
        (): void => {
          for (let pair of returnAndExpectedValues) {
            expect(pair[0]).to.eql(pair[1]);
          }
        });
      it('should insert the correct steps into the algo step queue',
        (): void => {
          expect(algoStepQueue).to.eql(
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

    //TODO finish writing this test
    xdescribe('test on big b+tree', (): void => {
      const {returnValues: actualValues, queue: algoStepQueue } = runFindTest(bigBPlusTree, 2, [6, 10, 5]);
      const expectedReturnValues = [
        { node: { isLeafNode: true, keys: [6], pointers: [] }, foundFlag: true },
        { node: { isLeafNode: true, keys: [10], pointers: [] }, foundFlag: true },
        { node: { isLeafNode: true, keys: [4, 6], pointers: [] }, foundFlag: false },
      ];
      const returnAndExpectedValues = zip([actualValues, expectedReturnValues]);
      it('should successfully find the 6,  and 10, and fail to find 5',
        (): void => {
          for (let pair of returnAndExpectedValues) {
            expect(pair[0]).to.eql(pair[1]);
          }
        });
      it('should insert the correct steps into the algo step queue',
        (): void => {
          expect(algoStepQueue).to.eql(
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
        expect(myBplusTree.getRoot()).to.eql(smallBPlusTree);
      });
    for (let num of [10, 11, 15]) {
      myBplusTree.insert(num);
    }

    it('should insert bigger series of numbers',
      (): void => {
        expect(myBplusTree.getRoot()).to.eql(bigBPlusTree);
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
