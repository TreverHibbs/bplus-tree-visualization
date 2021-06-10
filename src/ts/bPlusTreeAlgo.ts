/* each non leaf node in a B+tree other than the root has between n
 * and n/2 children, where n is fixxed for a particular tree; the root
 * has between 2 and n children. */

/* A typical node of a B+tree contains up to n-1 search-key values,
 * and n pointers. There search-key values within a node are kept
 * in sorted order. */
export interface BPlusTreeNode {
  isLeafNode: boolean;
  keys: number[];
  pointers: BPlusTreeNode[];
}

export const BPlusTreeNodeFactory = (leafValue: boolean): BPlusTreeNode => {
  const isLeafNode = leafValue;
  const keys: number[] = [];
  const pointers: BPlusTreeNode[] = [];

  return ({
    isLeafNode,
    keys,
    pointers
  });
}

export type BPlusTreeRoot = BPlusTreeNode | null;

export enum algoStepTypeEnum {
  SelectChild = "SELECTCHILD",
  Found = "FOUND",
  NotFound = "NOTFOUND"
}
interface algoStep {
  readonly type: algoStepTypeEnum;
}
export interface algoFindStep extends algoStep {
  readonly foundElementIndex?: number;
  readonly selectedChildIndex?: number;
}
export interface algoInsertStep extends algoStep {
}
export interface algoDeleteStep extends algoStep {
}
type algoQueueElement = (algoFindStep | algoInsertStep | algoDeleteStep);

export interface BPlusTree {
  getAlgoStepQueue: () => algoQueueElement[];
  getRoot: () => BPlusTreeRoot;
  setRoot: (newRoot: BPlusTreeRoot) => void;
  maxChildren: number;
  insert: (a: number) => void;
  find: (v: number) => findReturnType;
}

export type findReturnType = { node: BPlusTreeNode | null, foundFlag: boolean };


export const BPlusTreeFactory = (maxChildrenValue: number): BPlusTree => {

  const maxChildren = maxChildrenValue;
  let root: BPlusTreeRoot = null;
  // store a record of strings that will be used to animate the b+tree later
  const algoStepQueue: algoQueueElement[] = [];

  const getAlgoStepQueue = (): algoQueueElement[] => {
    return algoStepQueue;
  }

  const getRoot = (): BPlusTreeRoot => {
    return root;
  }

  const setRoot = (newRoot: BPlusTreeRoot): void => {
    root = newRoot;
    return;
  }

  /**
   * inserts a number into the B+tree
   * @param {number} value - The number to insert
   */
  const insert = (value: number): void => {
    let targetLeafnode: BPlusTreeNode;
    if (root === null) {
      // (tree is empty) create an empty leaf node, which is also the root.
      targetLeafnode = BPlusTreeNodeFactory(true);
    } else {
      // find the leaf node L that should contain key value K.
      const findReturnObj = find(value);
      if (findReturnObj.foundFlag) {
        // The value already exists in the tree don't insert duplicate 
        return;
      }
      if (findReturnObj.node) {
        targetLeafnode = findReturnObj.node;
      }
    }
    return;
  }

  /**
   * finds a number in a BPlusTree and updates the animation step queue
   * @param {number} value - The number to find
   * @return {BPlusTreeNode | null} currentNode - The node containing
   * the found number or null if not found
   */
  const find = (value: number): findReturnType => {
    if (root == null) {
      return { node: null, foundFlag: false };
    }

    let currentNode = root;
    while (!currentNode.isLeafNode) {
      let keyIndex = currentNode.keys.findIndex(key => (value <= key));
      if (keyIndex == -1) {
        // get last non null pointer in the node
        let lastPointer = currentNode.pointers.slice(-1)[0];

        // insert corresponding step into algoStepQueue
        algoStepQueue.push(
          {
            type: algoStepTypeEnum.SelectChild,
            selectedChildIndex: (currentNode.pointers.length - 1)
          })

        currentNode = lastPointer;
      }
      else if (value == currentNode.keys[keyIndex]) {
        const nextNodePointerIndex = keyIndex + 1;
        currentNode = currentNode.pointers[nextNodePointerIndex];
        algoStepQueue.push(
          {
            type: algoStepTypeEnum.SelectChild,
            selectedChildIndex: (nextNodePointerIndex)
          })
      }
      else {
        currentNode = currentNode.pointers[keyIndex];
        algoStepQueue.push(
          {
            type: algoStepTypeEnum.SelectChild,
            selectedChildIndex: keyIndex
          })
      }
    }
    // C is leaf Node
    const keyIndex = currentNode.keys.findIndex(key => (value == key));
    if (keyIndex != -1) {
      algoStepQueue.push(
        {
          type: algoStepTypeEnum.Found,
          foundElementIndex: keyIndex
        })
      return { node: currentNode, foundFlag: true }; // return pointer to actual data record
    } else {
      algoStepQueue.push(
        {
          type: algoStepTypeEnum.NotFound
        })
      return { node: currentNode, foundFlag: false }; // no record with key value *value* exists
      // return the current node anyways because it is needed for
    }
  }

  const newBPlusTree = {
    getAlgoStepQueue,
    getRoot,
    setRoot,
    maxChildren,
    insert,
    find
  };

  return (newBPlusTree);
}
