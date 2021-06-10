import {
  BPlusTreeFactory,
  BPlusTreeRoot,
  algoStepTypeEnum,
  algoQueueElement,
  findReturnType,
  BPlusTreeNode,
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
  interface testOptions {
    treeDegree: number;
    testNumbers: number[];
  }
  interface findTestOptions extends testOptions {
    treeRoot: BPlusTreeRoot;
  }
  interface testReturn {
    queue: algoQueueElement[];
  }
  interface findTestReturn extends testReturn {
    returnValues: findReturnType[]
  }
  interface insertTestReturn extends testReturn {
    returnValue: BPlusTreeRoot
  }

  const runFindTest = (parameters: findTestOptions): findTestReturn => {
    const { treeRoot, treeDegree, testNumbers, } = parameters;
    const myFindBPlusTree = BPlusTreeFactory(treeDegree);
    myFindBPlusTree.setRoot(treeRoot);

    const returnValues: findReturnType[] = [];
    for (let value of testNumbers) {
      returnValues.push(myFindBPlusTree.find(value));
    }
    return { returnValues, queue: myFindBPlusTree.getAlgoStepQueue() };
  }
  const runInsertTest = (parameters: testOptions): insertTestReturn => {
    const { treeDegree, testNumbers } = parameters;
    const myBPlusTree = BPlusTreeFactory(treeDegree);

    for (let value of testNumbers) {
      myBPlusTree.insert(value);
    }
    return { returnValue: myBPlusTree.getRoot(), queue: myBPlusTree.getAlgoStepQueue() };
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
      const smallBTreeTestparameters = { treeRoot: smallBPlusTree, treeDegree: 2, testNumbers: [6, 2, 3, 4, 10] };
      const { returnValues: actualReturnValues, queue: algoStepQueue } = runFindTest(smallBTreeTestparameters);
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

    describe('test on big b+tree', (): void => {
      const bigBPlusTreeParameters = { treeRoot: bigBPlusTree, treeDegree: 2, testNumbers: [6, 10, 5] };
      const { returnValues: actualValues, queue: algoStepQueue } = runFindTest(bigBPlusTreeParameters);
      const expectedReturnValues = [
        { node: { isLeafNode: true, keys: [6], pointers: [] }, foundFlag: true },
        { node: { isLeafNode: true, keys: [10], pointers: [] }, foundFlag: true },
        { node: { isLeafNode: true, keys: [4], pointers: [] }, foundFlag: false },
      ];
      const returnAndExpectedValues = zip([actualValues, expectedReturnValues]);
      it('should successfully find the 6,  and 10, and fail to find 5',
        (): void => {
          for (let value of returnAndExpectedValues) {
            expect(value[0]).to.eql(value[1]);
          }
        });
      it('should insert the correct steps into the algo step queue',
        (): void => {
          expect(algoStepQueue).to.eql(
            [
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
              { type: algoStepTypeEnum.Found, foundElementIndex: 0 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 2 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
              { type: algoStepTypeEnum.Found, foundElementIndex: 0 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
              { type: algoStepTypeEnum.NotFound }
            ]
          );
        });
    });
  });

  describe('BPlusTree insert func', (): void => {
    let { returnValue, queue } = runInsertTest({ treeDegree: 2, testNumbers: [2] });
    it('should initialize the root when first number is inserted',
      (): void => {
        expect(returnValue).to.not.be.a('null');
        expect(returnValue).to.have.property('keys').eql([2]);
        expect(returnValue).to.have.property('pointers').eql([]);
        expect(returnValue).to.have.property('isLeafNode').eql(true);
        expect(queue).to.eql([
            { type: algoStepTypeEnum.InitRoot },
            { type: algoStepTypeEnum.InsertInLeaf },
        ]);
      });

    describe('BPlusTree insert func', (): void => {
      let numbersToInsert = [2, 3, 4, 6];
      const insertTestReturn = runInsertTest({ treeDegree: 2, testNumbers: numbersToInsert });
      it('should insert 2, 3, 4, and 6 and qual the samll b+tree',
        (): void => {
          expect(insertTestReturn.returnValue).to.eql(smallBPlusTree);
        });
      it('should result in correct algo step queue for small b+tree',
        (): void => {
          expect(insertTestReturn.queue).to.eql([
            { type: algoStepTypeEnum.InitRoot },
            { type: algoStepTypeEnum.InsertInLeaf },
          ]);
        });
    });
    it('should insert big b+tree numbers',
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
