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

interface algoStep {
  readonly type: string;
}
export interface algoFindStep extends algoStep {
  readonly foundElementIndex?: number;
}
export interface algoInsertStep extends algoStep {
}
export interface algoDeleteStep extends algoStep {
}
type algoQueueElement = (algoFindStep|algoInsertStep|algoDeleteStep);

export interface BPlusTree {
  getAlgoStepQueue: () => algoQueueElement[];
  getRoot: () => BPlusTreeRoot;
  setRoot: (newRoot: BPlusTreeRoot) => void;
  maxChildren: number;
  insert: (a: number) => void;
  find: (v: number) => BPlusTreeNode | null;
}


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

  const insert = (value: number): void => {
    if (root === null) {
      // (tree is empty) create an empty leaf node, which is also the root.
      root = BPlusTreeNodeFactory(true);
      root.keys.push(value);
      root.isLeafNode = true;
    } else {
      // find the leaf node L that should contain key value K.
    }
    return;
  }

  /**
   * finds a number in a BPlusTree
   * @param {number} value - The number to find
   * @return {BPlusTreeNode | null} currentNode - The node containing
   * the found number or null if not found
   */
  const find = (value: number): BPlusTreeNode | null => {
    if (root == null) {
      return null;
    }

    let currentNode = root;
    while (!currentNode.isLeafNode) {
      let keyIndex = root.keys.findIndex(key => (value <= key));
      if (keyIndex == -1) {
        // get last non null pointer in the node
        let lastPointer = root.pointers.slice(-1)[0];
        currentNode = lastPointer;
      }
      else if (value == root.keys[keyIndex]) {
        currentNode = currentNode.pointers[keyIndex + 1];
      }
      else {
        currentNode = currentNode.pointers[keyIndex];
      }
    }
    // C is leaf Node
    const keyIndex = currentNode.keys.findIndex(key => (value == key));
    if (keyIndex != -1) {
      return currentNode; // return pointer to actual data record
    } else {
      return null; // no record with key value *value* exists
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
