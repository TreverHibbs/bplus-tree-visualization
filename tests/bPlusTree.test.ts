import {
  BPlusTreeFactory,
  BPlusTreeRoot,
  algoStepTypeEnum,
  algoQueueElement,
  findReturnType,
  BPlusTree,
  appendAllPointersValues,
  BPlusTreeNode,
} from "../src/ts/bPlusTreeAlgo";
import { expect } from "chai";
import * as chai from "chai";
import chaiExclude from "chai-exclude";
import { zip, makeFilledArray } from "../src/ts/util";

chai.use(chaiExclude);

const linkLeafNodes = (leafNodes: any[], maxKeys: number): void => {
  for (let i in leafNodes) {
    if (parseInt(i) == leafNodes.length - 1) {
      // dont try to add out of bounds leaf
      break;
    }
    leafNodes[i].pointers.splice(
      0,
      maxKeys + 1,
      ...makeFilledArray(null, maxKeys + 1)
    );
    leafNodes[i].pointers.splice(-1, 1, leafNodes[parseInt(i) + 1]);
  }
};

interface BPlusTreeTestNode {
  isLeafNode: boolean;
  keys: (number | null)[];
  pointers: (BPlusTreeTestNode | null)[];
}

type BPlusTreeTestRoot = BPlusTreeTestNode | null;

describe("BPlusTree", (): void => {
  //+++ Small B Plus Tree Definition +++//
  //TODO refactor this test code
  const smallBPlusTreeNumbers = [2, 3, 4, 6];

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
  //+++ Small B Plus Tree with 3 deleted Definition +++//
  const smallBPlusTreeLeafNodesD3 = [
    { isLeafNode: true, keys: [2, null], pointers: [] },
    { isLeafNode: true, keys: [4, 6], pointers: [] },
    null,
  ];
  linkLeafNodes(smallBPlusTreeLeafNodesD3, 2);

  const smallBPlusTreeD3 = {
    isLeafNode: false,
    keys: [4, null],
    pointers: smallBPlusTreeLeafNodesD3,
  };
  //+++ Small B Plus Tree with 3, 2 deleted Definition +++//
  const smallBPlusTreeD3and2 = {
    isLeafNode: false,
    keys: [4, 16],
    pointers: [null, null, null],
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
        pointers: [bigBPlusTreeLeafNodes[0], bigBPlusTreeLeafNodes[1], null],
        isLeafNode: false,
      },
      {
        keys: [15, null],
        pointers: [bigBPlusTreeLeafNodes[2], bigBPlusTreeLeafNodes[3], null],
        isLeafNode: false,
      },
      null,
    ],
  };

  //+++ Large B Plus Tree Definition +++//
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
      pointers: [],
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

  //+++ Huge B Plus Tree Definition +++//
  const hugeBPlusTreeLeafNodes = [
    {
      keys: [2, 3, 4, 5],
      pointers: [null, null, null, null, null],
      isLeafNode: true,
    },
    {
      keys: [6, 10, 11, 13],
      pointers: [null, null, null, null, null],
      isLeafNode: true,
    },
    {
      keys: [15, 22, 28, null],
      pointers: [null, null, null, null, null],
      isLeafNode: true,
    },
    {
      isLeafNode: true,
      keys: [32, 33, null, null],
      pointers: [null, null, null, null, null],
    },
    {
      keys: [35, 43, 47, null],
      pointers: [null, null, null, null, null],
      isLeafNode: true,
    },
    {
      keys: [70, 76, 84, null],
      pointers: [null, null, null, null, null],
      isLeafNode: true,
    },
    {
      keys: [88, 94, 100, null],
      pointers: [null, null, null, null, null],
      isLeafNode: true,
    },
  ];
  const HugeBPlusTree = {
    keys: [35, null, null, null],
    pointers: [
      {
        keys: [6, 15, 32, null],
        pointers: [
          hugeBPlusTreeLeafNodes[0],
          hugeBPlusTreeLeafNodes[1],
          hugeBPlusTreeLeafNodes[2],
          hugeBPlusTreeLeafNodes[3],
          null,
        ],
        isLeafNode: false,
      },
      {
        keys: [70, 88, null, null],
        pointers: [
          hugeBPlusTreeLeafNodes[4],
          hugeBPlusTreeLeafNodes[5],
          hugeBPlusTreeLeafNodes[6],
          null,
          null,
        ],
        isLeafNode: false,
      },
      null,
      null,
      null,
    ],
    isLeafNode: false,
  };

  linkLeafNodes(hugeBPlusTreeLeafNodes, 4);

  //+++ Huge B Plus Tree max keys 5 Definition +++//
  const hugeBPlusTreeLeafNodesM5 = [
    {
      keys: [2, 3, 4, 5, null],
      pointers: [null, null, null, null, null, null],
      isLeafNode: true,
    },
    {
      keys: [6, 10, 11, null, null],
      pointers: [null, null, null, null, null, null],
      isLeafNode: true,
    },
    {
      keys: [13, 15, 22, null, null],
      pointers: [null, null, null, null, null, null],
      isLeafNode: true,
    },
    {
      isLeafNode: true,
      keys: [28, 32, 33, 35, null],
      pointers: [null, null, null, null, null, null],
    },
    {
      keys: [43, 47, 70, 76, null],
      pointers: [null, null, null, null, null, null],
      isLeafNode: true,
    },
    {
      keys: [84, 88, 94, 100, null],
      pointers: [null, null, null, null, null, null],
      isLeafNode: true,
    },
  ];
  const HugeBPlusTreeM5 = {
    keys: [6, 13, 28, 43, 84],
    pointers: [
      hugeBPlusTreeLeafNodesM5[0],
      hugeBPlusTreeLeafNodesM5[1],
      hugeBPlusTreeLeafNodesM5[2],
      hugeBPlusTreeLeafNodesM5[3],
      hugeBPlusTreeLeafNodesM5[4],
      hugeBPlusTreeLeafNodesM5[5],
    ],
    isLeafNode: false,
  };
  linkLeafNodes(hugeBPlusTreeLeafNodesM5, 5);

  //+++ Huge B Plus Tree max keys 2 Definition +++//
  const hugeBPlusTreeLeafNodesM2 = [
    {
      keys: [2, 3],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [4, 5],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [6, null],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      isLeafNode: true,
      keys: [10, 11],
      pointers: [null, null, null],
    },
    {
      keys: [13, null],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [15, 22],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [28, 32],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [33, null],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [35, null],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [43, 47],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [70, 76],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [84, null],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [88, 94],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [100, null],
      pointers: [null, null, null],
      isLeafNode: true,
    },
  ];
  linkLeafNodes(hugeBPlusTreeLeafNodesM2, 2);
  const HugeBPlusTreeM2 = {
    keys: [15, 43],
    pointers: [
      {
        keys: [10, null],
        pointers: [
          {
            keys: [4, 6],
            pointers: [
              hugeBPlusTreeLeafNodesM2[0],
              hugeBPlusTreeLeafNodesM2[1],
              hugeBPlusTreeLeafNodesM2[2],
            ],
            isLeafNode: false,
          },
          {
            keys: [13, null],
            pointers: [
              hugeBPlusTreeLeafNodesM2[3],
              hugeBPlusTreeLeafNodesM2[4],
              null,
            ],
            isLeafNode: false,
          },
          null,
        ],
        isLeafNode: false,
      },
      {
        keys: [33, null],
        pointers: [
          {
            keys: [28, null],
            pointers: [
              hugeBPlusTreeLeafNodesM2[5],
              hugeBPlusTreeLeafNodesM2[6],
              null,
            ],
            isLeafNode: false,
          },
          {
            keys: [35, null],
            pointers: [
              hugeBPlusTreeLeafNodesM2[7],
              hugeBPlusTreeLeafNodesM2[8],
              null,
            ],
            isLeafNode: false,
          },
          null,
        ],
        isLeafNode: false,
      },
      {
        keys: [84, null],
        pointers: [
          {
            keys: [70, null],
            pointers: [
              hugeBPlusTreeLeafNodesM2[9],
              hugeBPlusTreeLeafNodesM2[10],
              null,
            ],
            isLeafNode: false,
          },
          {
            keys: [88, 100],
            pointers: [
              hugeBPlusTreeLeafNodesM2[11],
              hugeBPlusTreeLeafNodesM2[12],
              hugeBPlusTreeLeafNodesM2[13],
            ],
            isLeafNode: false,
          },
          null,
        ],
        isLeafNode: false,
      },
    ],
    isLeafNode: false,
  };

  //+++ Test Interfaces +++//
  const MaxKeys3TreeLeafNodes = [
    {
      keys: [2, 3, null],
      pointers: [null, null, null, null],
      isLeafNode: true,
    },
    {
      keys: [4, 6, null],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      keys: [10, 11, 13],
      pointers: [null, null, null],
      isLeafNode: true,
    },
    {
      isLeafNode: true,
      keys: [15, 43, null],
      pointers: [null, null, null, null],
    },
  ];
  linkLeafNodes(MaxKeys3TreeLeafNodes, 3);
  const MaxKeys3Tree = {
    keys: [4, 10, 15],
    pointers: MaxKeys3TreeLeafNodes,
    isLeafNode: false,
  };

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
    const { treeRoot, treeDegree, testNumbers } = parameters;
    const myFindBPlusTree = BPlusTreeFactory(treeDegree);
    myFindBPlusTree.setRoot(treeRoot);

    const returnValues: findReturnType[] = [];
    for (let value of testNumbers) {
      returnValues.push(myFindBPlusTree.find(value));
    }
    return { returnValues, queue: myFindBPlusTree.getAlgoStepQueue() };
  };
  const runInsertTest = (parameters: testOptions): BPlusTree => {
    const { treeDegree, testNumbers } = parameters;
    const myBPlusTree = BPlusTreeFactory(treeDegree);

    for (let value of testNumbers) {
      myBPlusTree.insert(value);
    }
    return myBPlusTree;
  };
  const runDeleteTest = (
    numbersToDelete: number[],
    testBPlusTree: BPlusTree
  ): BPlusTree => {
    for (let value of numbersToDelete) {
      testBPlusTree.deleteNum(value);
    }
    return testBPlusTree;
  };

  const makeBPlusTreeInsertTestCase = (
    numbersToInsert: number[],
    maxKeysTestValue: number,
    expectedBPlusTree: any,
    expectedAlgoQueue: algoQueueElement[],
    logFlag = false
  ) => {
    const testBPlusTree = runInsertTest({
      treeDegree: maxKeysTestValue,
      testNumbers: numbersToInsert,
    });
    const BPlusTreeTestResult = testBPlusTree.getRoot();
    const BPlusTreeAlgoQueue = testBPlusTree.getAlgoStepQueue();
    describe(`insert b+tree ${numbersToInsert} with maxKeys of ${maxKeysTestValue}`, (): void => {
      it("should insert b+tree numbers", (): void => {
        expect(BPlusTreeTestResult)
          .excludingEvery(objectsToExclude)
          .to.deep.equal(expectedBPlusTree);
      });
      xit("should result in correct algo step queue for b+tree", (): void => {
        expect(BPlusTreeAlgoQueue).to.eql(expectedAlgoQueue);
      });
      if (logFlag) {
        console.info(
          `b plus tree with maxKeys ${maxKeysTestValue} and numbers to insert ${numbersToInsert} result\n`
        );
        console.dir(BPlusTreeTestResult);
        console.info(`expected b plus tree\n`);
        console.dir(expectedBPlusTree);
      }
    });
    return testBPlusTree;
  };

  const makeBPlusTreeDeleteTestCase = (
    inputBPlusTree: BPlusTree,
    expectedBPlusTree: any,
    expectedAlgoQueue: algoQueueElement[],
    numbersToDelete: number[],
    logFlag = false
  ) => {
    describe(`numbers to delete ${numbersToDelete}`, (): void => {
      const DeleteTestReturn = runDeleteTest(numbersToDelete, inputBPlusTree);
      const TestReturnTreeRoot = DeleteTestReturn.getRoot();
      const testReturnQueue = DeleteTestReturn.getAlgoStepQueue();
      it("should delete b+tree numbers", (): void => {
        expect(TestReturnTreeRoot)
          .excludingEvery(objectsToExclude)
          .to.deep.equal(expectedBPlusTree);
      });
      xit("should result in correct algo step queue for b+tree", (): void => {
        expect(testReturnQueue).to.eql(expectedAlgoQueue);
      });
      if (logFlag) {
        console.log(`result of delete test with numbers ${numbersToDelete}\n`);
        console.dir(TestReturnTreeRoot);
        console.log("expected b plus tree\n");
        console.dir(expectedBPlusTree);
      }
    });
  };

  const myBplusTree = BPlusTreeFactory(2);
  describe("BPlusTreeFactory", () => {
    // the tests container
    it("should return BPlusTree object with null root and maxChildren set", (): void => {
      expect(myBplusTree).to.include({ maxKeys: 2 });
    });
  });

  const objectsToExclude = ["getParentNode", "setParentNode"];
  describe("BPlusTree find func", (): void => {
    describe("test find on small b+tree", (): void => {
      const smallBTreeTestparameters = {
        treeRoot: smallBPlusTree,
        treeDegree: 2,
        testNumbers: [6, 2, 3, 4, 10],
      };
      const { returnValues: actualReturnValues, queue: algoStepQueue } =
        runFindTest(smallBTreeTestparameters);
      const expectedReturnValues = [
        { node: smallBPlusTreeLeafNodes[1], foundFlag: true },
        { node: smallBPlusTreeLeafNodes[0], foundFlag: true },
        { node: smallBPlusTreeLeafNodes[0], foundFlag: true },
        { node: smallBPlusTreeLeafNodes[1], foundFlag: true },
        { node: smallBPlusTreeLeafNodes[1], foundFlag: false },
      ];
      const returnAndExpectedValues = zip([
        actualReturnValues,
        expectedReturnValues,
      ]);
      it("should successfully find the numbers 6, 2, 3, and 4 and fail to find 10", (): void => {
        for (let pair of returnAndExpectedValues) {
          expect(pair[0]).to.eql(pair[1]);
        }
      });
      it("should insert the correct steps into the algo step queue", (): void => {
        expect(algoStepQueue).to.eql([
          { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
          { type: algoStepTypeEnum.Found, foundElementIndex: 1 },
          { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
          { type: algoStepTypeEnum.Found, foundElementIndex: 0 },
          { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
          { type: algoStepTypeEnum.Found, foundElementIndex: 1 },
          { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
          { type: algoStepTypeEnum.Found, foundElementIndex: 0 },
          { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
          { type: algoStepTypeEnum.NotFound },
        ]);
      });
      //console.debug(
      //  "algo step queue of small b tree find test\n",
      //  algoStepQueue
      //);
    });

    describe("test find on big b+tree", (): void => {
      const bigBPlusTreeParameters = {
        treeRoot: bigBPlusTree,
        treeDegree: 2,
        testNumbers: [6, 10, 5],
      };
      const { returnValues: actualValues, queue: algoStepQueue } = runFindTest(
        bigBPlusTreeParameters
      );
      const expectedReturnValues = [
        { node: bigBPlusTreeLeafNodes[1], foundFlag: true },
        { node: bigBPlusTreeLeafNodes[2], foundFlag: true },
        { node: bigBPlusTreeLeafNodes[1], foundFlag: false },
      ];
      const returnAndExpectedValues = zip([actualValues, expectedReturnValues]);
      it("should successfully find the 6, and 10, and fail to find 5", (): void => {
        for (let value of returnAndExpectedValues) {
          expect(value[0]).to.eql(value[1]);
        }
      });
      it("should insert the correct steps into the algo step queue", (): void => {
        expect(algoStepQueue).to.eql([
          { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
          { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
          { type: algoStepTypeEnum.Found, foundElementIndex: 1 },
          { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
          { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
          { type: algoStepTypeEnum.Found, foundElementIndex: 0 },
          { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 0 },
          { type: algoStepTypeEnum.SelectChild, selectedChildIndex: 1 },
          { type: algoStepTypeEnum.NotFound },
        ]);
      });
    });
  });

  describe("BPlusTree insert func", (): void => {
    let testBPlusTree = runInsertTest({ treeDegree: 2, testNumbers: [2] });
    let returnValue = testBPlusTree.getRoot();
    let queue = testBPlusTree.getAlgoStepQueue();
    describe("insert initial root", (): void => {
      it("should initialize the root when first number is inserted", (): void => {
        expect(returnValue).to.not.be.a("null");
        expect(returnValue).to.have.property("isLeafNode").eql(true);
        expect(returnValue).to.have.property("keys").eql([2, null]);
        expect(returnValue)
          .to.have.property("pointers")
          .eql([null, null, null]);
        expect(queue).to.eql([
          { type: algoStepTypeEnum.InitRoot },
          { type: algoStepTypeEnum.InsertInLeaf },
        ]);
      });
    });

    //+++ inserte tests +++//
    let numbersToInsert = [2, 3, 4, 6];
    makeBPlusTreeInsertTestCase(numbersToInsert, 2, smallBPlusTree, [], false);

    numbersToInsert = [2, 3, 4, 6, 15, 10, 11];
    makeBPlusTreeInsertTestCase(numbersToInsert, 2, bigBPlusTree, []);

    numbersToInsert.push(43, 13);
    makeBPlusTreeInsertTestCase(numbersToInsert, 2, LargeBPlusTree, []);

    makeBPlusTreeInsertTestCase(numbersToInsert, 3, MaxKeys3Tree, []);

    numbersToInsert.push(
      70,
      28,
      84,
      6,
      35,
      88,
      100,
      22,
      76,
      47,
      32,
      94,
      5,
      33,
      70
    );
    //2,3,4,6,15,10,11,43,13,70,28,84,6,35,88,100,22,76,47,32,94,5,33,70
    makeBPlusTreeInsertTestCase(numbersToInsert, 4, HugeBPlusTree, []);

    makeBPlusTreeInsertTestCase(numbersToInsert, 5, HugeBPlusTreeM5, []);

    makeBPlusTreeInsertTestCase(numbersToInsert, 2, HugeBPlusTreeM2, []);
  });
  describe("BPlusTree delete func", (): void => {
    makeBPlusTreeDeleteTestCase(
      runInsertTest({ treeDegree: 2, testNumbers: smallBPlusTreeNumbers }),
      smallBPlusTreeD3,
      [],
      [3],
      false
    );
    makeBPlusTreeDeleteTestCase(
      runInsertTest({ treeDegree: 2, testNumbers: smallBPlusTreeNumbers }),
      smallBPlusTreeD3and2,
      [],
      [3, 2],
      true
    );
  });
  describe("BPlusTree helper func", (): void => {
    describe("append two nodes", (): void => {
      it("should append all key value pairs of first node to second node", (): void => {
        const node = {
          isLeafNode: true,
          keys: [2, 3, null, null],
          pointers: [1, 2, null, null],
        };
        const nodePrime = {
          isLeafNode: true,
          keys: [4, 6, null, null],
          pointers: [1, 2, null, null],
        };
        appendAllPointersValues(
          node as any as BPlusTreeNode,
          nodePrime as any as BPlusTreeNode
        );
        expect(nodePrime.keys).to.deep.equal([4, 6, 2, 3]);
        expect(nodePrime.pointers).to.deep.equal([1, 2, 1, 2]);
      });
    });
  });
});
