import {
  BPlusTreeFactory,
  BPlusTreeRoot,
  algoStepTypeEnum,
  algoQueueElement,
  findReturnType,
} from '../src/ts/bPlusTreeAlgo';
import { expect } from 'chai';
import * as chai from 'chai';
import chaiExclude from 'chai-exclude';
import { zip } from '../src/ts/util';

chai.use(chaiExclude);


const linkLeafNodes = (leafNodes: any[]): void => {
  for (let i in leafNodes) {
    if (parseInt(i) == leafNodes.length - 1) {
      // dont try to add out of bounds leaf
      break;
    }
    leafNodes[i].pointers.push(leafNodes[parseInt(i) + 1]);
  }
}

interface BPlusTreeTestNode {
  isLeafNode: boolean;
  keys: (number | null)[];
  pointers: (BPlusTreeTestNode | null)[];
}

type BPlusTreeTestRoot = BPlusTreeTestNode | null;

describe('BPlusTree', (): void => {
  /* initialize big B+tree for testing */

  const bigBPlusTreeLeafNodes = [
    {
      isLeafNode: true,
      keys: [2, null],
      pointers: [null, null]
    },
    {
      isLeafNode: true,
      keys: [3, null],
      pointers: [null, null]
    },
    {
      isLeafNode: true,
      keys: [4, null],
      pointers: [null, null]
    },
    {
      isLeafNode: true,
      keys: [6, null],
      pointers: [null, null]
    },
    {
      isLeafNode: true,
      keys: [10, null],
      pointers: [null, null]
    },
    {
      isLeafNode: true,
      keys: [11, 15],
      pointers: [null, null]
    }
  ];
  linkLeafNodes(bigBPlusTreeLeafNodes);

  const bigBPlusTree = {
    isLeafNode: false,
    keys: [4, 10],
    pointers: [
      {
        isLeafNode: false,
        keys: [3, null],
        pointers: [
          bigBPlusTreeLeafNodes[0],
          bigBPlusTreeLeafNodes[1],
        ]
      },
      {
        isLeafNode: false,
        keys: [6, null],
        pointers: [
          bigBPlusTreeLeafNodes[2],
          bigBPlusTreeLeafNodes[3],
        ]
      },
      {
        isLeafNode: false,
        keys: [11, null],
        pointers: [
          bigBPlusTreeLeafNodes[4],
          bigBPlusTreeLeafNodes[5],
        ]
      }
    ]
  };

  const smallBPlusTreeLeafNodes = [
    { isLeafNode: true, keys: [2, null], pointers: [] },
    { isLeafNode: true, keys: [3, null], pointers: [] },
    { isLeafNode: true, keys: [4, 6], pointers: [] }
  ];
  linkLeafNodes(smallBPlusTreeLeafNodes);

  const smallBPlusTree = {
    isLeafNode: false,
    keys: [3, 4],
    pointers: smallBPlusTreeLeafNodes,
  };
  interface testOptions {
    treeDegree: number;
    testNumbers: number[];
  }
  interface findTestOptions extends testOptions {
    treeRoot: any;
  }
  interface testReturn {
    queue: algoQueueElement[];
  }
  interface findTestReturn extends testReturn {
    returnValues: findReturnType[];
  }
  interface insertTestReturn extends testReturn {
    returnValue: BPlusTreeTestRoot;
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
    describe('test find on small b+tree', (): void => {
      const smallBTreeTestparameters = { treeRoot: smallBPlusTree, treeDegree: 2, testNumbers: [6, 2, 3, 4, 10] };
      const { returnValues: actualReturnValues, queue: algoStepQueue } = runFindTest(smallBTreeTestparameters);
      const expectedReturnValues = [
        { node: smallBPlusTreeLeafNodes[2], foundFlag: true },
        { node: smallBPlusTreeLeafNodes[0], foundFlag: true },
        { node: smallBPlusTreeLeafNodes[1], foundFlag: true },
        { node: smallBPlusTreeLeafNodes[2], foundFlag: true },
        { node: smallBPlusTreeLeafNodes[2], foundFlag: false },
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

    describe('test find on big b+tree', (): void => {
      const bigBPlusTreeParameters = { treeRoot: bigBPlusTree, treeDegree: 2, testNumbers: [6, 10, 5] };
      const { returnValues: actualValues, queue: algoStepQueue } = runFindTest(bigBPlusTreeParameters);
      const expectedReturnValues = [
        { node: bigBPlusTreeLeafNodes[3], foundFlag: true },
        { node: bigBPlusTreeLeafNodes[4], foundFlag: true },
        { node: bigBPlusTreeLeafNodes[2], foundFlag: false },
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
    describe('insert initial root', (): void => {
      it('should initialize the root when first number is inserted',
        (): void => {
          expect(returnValue).to.not.be.a('null');
          expect(returnValue).to.have.property('keys').eql([2, null]);
          expect(returnValue).to.have.property('pointers').eql([null, null]);
          expect(returnValue).to.have.property('isLeafNode').eql(true);
          expect(queue).to.eql([
            { type: algoStepTypeEnum.InitRoot },
            { type: algoStepTypeEnum.InsertInLeaf },
          ]);
        });
    });

    //TODO fix the use of the chai exclude feature
    describe('insert small b+tree', (): void => {
      let numbersToInsert = [2, 3, 4, 6];
      const insertTestReturn = runInsertTest({ treeDegree: 2, testNumbers: numbersToInsert });
      const smallBPlusTreeTestResult = insertTestReturn.returnValue;
      it('should insert 2, 3, 4, and 6 and qual the samll b+tree',
        (): void => {
          console.dir(smallBPlusTreeTestResult);
          console.dir(smallBPlusTree);
          expect(smallBPlusTreeTestResult).excludingEvery(['parentNode', 'setParentNode']).to.deep.equal(smallBPlusTree);
        });
      it('should result in correct algo step queue for small b+tree',
        (): void => {
          expect(insertTestReturn.queue).to.eql([
            { type: algoStepTypeEnum.InitRoot },
            { type: algoStepTypeEnum.InsertInLeaf },
            { type: algoStepTypeEnum.NotFound },
            { type: algoStepTypeEnum.InsertInLeaf },
            { type: algoStepTypeEnum.NotFound },
            { type: algoStepTypeEnum.SplitNode },
            { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
            { type: algoStepTypeEnum.NotFound },
            { type: algoStepTypeEnum.SplitNode },
          ]);
        });
    });

    describe('insert big b+tree', (): void => {
      let numbersToInsert = [2, 3, 4, 6, 15, 10, 11];
      const insertTestReturn = runInsertTest({ treeDegree: 2, testNumbers: numbersToInsert });
      const BigBPlusTreeTestResult = insertTestReturn.returnValue;
      it('should insert big b+tree numbers',
        (): void => {
          expect(BigBPlusTreeTestResult).excludingEvery(['parentNode', 'setParentNode']).to.deep.equal(bigBPlusTree);
        });

      it('should insert series of numbers with n = 3',
        (): void => {
          const myN3Tree = BPlusTreeFactory(3);
          let numbersToInsert = [2, 5, 10, 4];
          for (let num of numbersToInsert) {
            myN3Tree.insert(num);
          }
          expect(myN3Tree.getRoot()).excludingEvery(['parentNode', 'setParentNode']).to.deep.equal({
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
});
