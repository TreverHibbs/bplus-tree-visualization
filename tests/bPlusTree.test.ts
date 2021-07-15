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
import { zip, makeFilledArray } from '../src/ts/util';

chai.use(chaiExclude);


const linkLeafNodes = (leafNodes: any[], maxKeys: number): void => {
  for (let i in leafNodes) {
    if (parseInt(i) == leafNodes.length - 1) {
      // dont try to add out of bounds leaf
      break;
    }
    leafNodes[i].pointers.splice(0, maxKeys + 1, ...makeFilledArray(null, maxKeys + 1));
    leafNodes[i].pointers.splice(-1, 1, leafNodes[parseInt(i) + 1]);
  }
}

interface BPlusTreeTestNode {
  isLeafNode: boolean;
  keys: (number | null)[];
  pointers: (BPlusTreeTestNode | null)[];
}

type BPlusTreeTestRoot = BPlusTreeTestNode | null;



describe('BPlusTree', (): void => {
  //+++ Small B Plus Tree Definition +++//
  const smallBPlusTreeLeafNodes = [
    { isLeafNode: true, keys: [2, 3], pointers: [] },
    { isLeafNode: true, keys: [4, 6], pointers: [] },
    null,
  ];
  linkLeafNodes(smallBPlusTreeLeafNodes, 2);

  const smallBPlusTree = {
    isLeafNode: false,
    keys: [4, null],
    pointers: smallBPlusTreeLeafNodes,
  };

  //+++ Big B Plus Tree Definition +++//
  const bigBPlusTreeLeafNodes = [
    {
      keys: [2, 3],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [4, 6],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [10, 11],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [15, null],
      pointers: [null, null, null],
      isLeafNode: true,
    },
  ];
  linkLeafNodes(bigBPlusTreeLeafNodes, 2);

  const bigBPlusTree = {
    keys: [10, null],
    isLeafNode: false,
    pointers: [
      {
        keys: [4, null],
        pointers: [
          bigBPlusTreeLeafNodes[0],
          bigBPlusTreeLeafNodes[1],
          null,
        ],
        isLeafNode: false,
      },
      {
        keys: [15, null],
        pointers: [
          bigBPlusTreeLeafNodes[2],
          bigBPlusTreeLeafNodes[3],
          null,
        ],
        isLeafNode: false,
      },
      null,
    ]
  }

  //+++ Large B Plus Tree Definition +++//
  //TODO refactor to use less code
  const LargeBPlusTree = JSON.parse(JSON.stringify(bigBPlusTree));
  const largeBPlusTreeLeafNodes = [
    {
      keys: [2, 3],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [4, 6],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [10, 11],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    { 
      isLeafNode: true, 
      keys: [13, null], 
      pointers: [] 
    },
    {
      keys: [15, 43],
      pointers: [null, null, null],
      isLeafNode: true,
    },
  ];
  linkLeafNodes(largeBPlusTreeLeafNodes, 2);
  LargeBPlusTree.pointers[1].keys.splice(0, 0, 13);
  LargeBPlusTree.pointers[1].keys.splice(2, 1);
  LargeBPlusTree.pointers[0].pointers[0] = largeBPlusTreeLeafNodes[0];
  LargeBPlusTree.pointers[0].pointers[1] = largeBPlusTreeLeafNodes[1];
  LargeBPlusTree.pointers[1].pointers[0] = largeBPlusTreeLeafNodes[2];
  LargeBPlusTree.pointers[1].pointers[1] = largeBPlusTreeLeafNodes[3];
  LargeBPlusTree.pointers[1].pointers[2] = largeBPlusTreeLeafNodes[4];

  //+++ Test Interfaces +++//
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

  //+++ Test Helper Functions +++//
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
        expect(myBplusTree).to.include({ maxKeys: 2 });
      });
  });


  const objectsToExclude = ['getParentNode', 'setParentNode'];
  describe('BPlusTree find func', (): void => {
    describe('test find on small b+tree', (): void => {
      const smallBTreeTestparameters = { treeRoot: smallBPlusTree, treeDegree: 2, testNumbers: [6, 2, 3, 4, 10] };
      const { returnValues: actualReturnValues, queue: algoStepQueue } = runFindTest(smallBTreeTestparameters);
      const expectedReturnValues = [
        { node: smallBPlusTreeLeafNodes[1], foundFlag: true },
        { node: smallBPlusTreeLeafNodes[0], foundFlag: true },
        { node: smallBPlusTreeLeafNodes[0], foundFlag: true },
        { node: smallBPlusTreeLeafNodes[1], foundFlag: true },
        { node: smallBPlusTreeLeafNodes[1], foundFlag: false },
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
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
              { type: algoStepTypeEnum.Found, foundElementIndex: 1 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
              { type: algoStepTypeEnum.Found, foundElementIndex: 0 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
              { type: algoStepTypeEnum.Found, foundElementIndex: 1 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
              { type: algoStepTypeEnum.Found, foundElementIndex: 0 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
              { type: algoStepTypeEnum.NotFound }
            ]
          );
        });
      console.debug("algo step queue of small b tree find test\n", algoStepQueue);
    });

    describe('test find on big b+tree', (): void => {
      const bigBPlusTreeParameters = { treeRoot: bigBPlusTree, treeDegree: 2, testNumbers: [6, 10, 5] };
      const { returnValues: actualValues, queue: algoStepQueue } = runFindTest(bigBPlusTreeParameters);
      const expectedReturnValues = [
        { node: bigBPlusTreeLeafNodes[1], foundFlag: true },
        { node: bigBPlusTreeLeafNodes[2], foundFlag: true },
        { node: bigBPlusTreeLeafNodes[1], foundFlag: false },
      ];
      const returnAndExpectedValues = zip([actualValues, expectedReturnValues]);
      it('should successfully find the 6, and 10, and fail to find 5',
        (): void => {
          for (let value of returnAndExpectedValues) {
            expect(value[0]).to.eql(value[1]);
          }
        });
      it('should insert the correct steps into the algo step queue',
        (): void => {
          expect(algoStepQueue).to.eql(
            [
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
              { type: algoStepTypeEnum.Found, foundElementIndex: 1 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
              { type: algoStepTypeEnum.Found, foundElementIndex: 0 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
              { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
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
          expect(returnValue).to.have.property('isLeafNode').eql(true);
          expect(returnValue).to.have.property('keys').eql([2, null]);
          expect(returnValue).to.have.property('pointers').eql([null, null, null]);
          expect(queue).to.eql([
            { type: algoStepTypeEnum.InitRoot },
            { type: algoStepTypeEnum.InsertInLeaf },
          ]);
        });
    });

    let numbersToInsert = [2, 3, 4, 6];
    describe(`insert small b+tree ${numbersToInsert}`, (): void => {
      const insertTestReturn = runInsertTest({ treeDegree: 2, testNumbers: numbersToInsert });
      const smallBPlusTreeTestResult = insertTestReturn.returnValue;
      const smallBPlusTreeQueue = insertTestReturn.queue;
      //console.dir("small B plus tree test results\n", smallBPlusTreeTestResult);
      //console.dir("small B plus tree\n", smallBPlusTree);
      it('should result in correct BPlusTree',
        (): void => {
          expect(smallBPlusTreeTestResult).excludingEvery(objectsToExclude).to.deep.equal(smallBPlusTree);
        });
      xit('should result in correct algo step queue for small b+tree',
        (): void => {
          expect(smallBPlusTreeQueue).to.eql([
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
  });

  let numbersToInsert = [2, 3, 4, 6, 15, 10, 11];
  describe(`insert big b+tree ${numbersToInsert}`, (): void => {
    const insertTestReturn = runInsertTest({ treeDegree: 2, testNumbers: numbersToInsert });
    const BigBPlusTreeTestResult = insertTestReturn.returnValue;
    const bigBPlusTreeAlgoQueue = insertTestReturn.queue;
    it('should insert big b+tree numbers',
      (): void => {
        expect(BigBPlusTreeTestResult).excludingEvery(objectsToExclude).to.deep.equal(bigBPlusTree);
      });

    xit('should result in correct algo step queue for big b+tree',
        (): void => {
          expect(bigBPlusTreeAlgoQueue).to.eql([
            { type: algoStepTypeEnum.InitRoot },
          ]);
        });
    //console.dir("big b plus tree result\n", BigBPlusTreeTestResult);
    //console.dir("big b plus tree\n", bigBPlusTree);
  });

  //TODO debug the insertion of 13
  numbersToInsert.push(43, 13);
  describe(`insert large b+tree ${numbersToInsert}`, (): void => {
    const insertTestReturn = runInsertTest({ treeDegree: 2, testNumbers: numbersToInsert });
    const LargeBPlusTreeTestResult = insertTestReturn.returnValue;
    const LargeBPlusTreeAlgoQueue = insertTestReturn.queue;
    it('should insert big b+tree numbers',
      (): void => {
        expect(LargeBPlusTreeTestResult).excludingEvery(objectsToExclude).to.deep.equal(LargeBPlusTree);
      });
    xit('should result in correct algo step queue for large b+tree',
        (): void => {
          expect(LargeBPlusTreeAlgoQueue).to.eql([
            { type: algoStepTypeEnum.InitRoot },
          ]);
        });
    console.dir("large b plus tree result\n", LargeBPlusTreeTestResult);
    console.dir("large b plus tree\n", LargeBPlusTree);
  });
});
