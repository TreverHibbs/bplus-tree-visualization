/* each non leaNodef node in a B+tree other than the root has between n
 * and n/2 children, where n is fixxed for a particular tree; the root
 * has between 2 and n children. */
import { fixedInsert, makeFilledArray } from './util';

/* A typical node of a B+tree contains up to n-1 search-key values,
 * and n pointers. There search-key values within a node are kept
 * in sorted order. */
export interface BPlusTreeNode {
  isLeafNode: boolean;
  keys: (number | null)[];
  pointers: (BPlusTreeNode | null)[];
  parentNode: BPlusTreeNode | null;
  setParentNode: (node: BPlusTreeNode) => void;
}


export type BPlusTreeRoot = BPlusTreeNode | null;

export enum algoStepTypeEnum {
  SelectChild = "SELECTCHILD",
  Found = "FOUND",
  NotFound = "NOTFOUND",
  InitRoot = "INITROOT",
  InsertInLeaf = "INSERTINLEAF",
  SplitNode = "SPLITNODE",
  DuplicateEntry = "DUPLICATEENTRY",
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
export type algoQueueElement = (algoFindStep | algoInsertStep | algoDeleteStep);

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

  const BPlusTreeNodeFactory = (leafValue = false): BPlusTreeNode => {
    let parentNode = null;
    let isLeafNode = leafValue;
    const keys: (number | null)[] = new Array(maxChildren);
    const pointers: (BPlusTreeNode | null)[] = new Array(maxChildren);
    keys.fill(null);
    pointers.fill(null);
    Object.seal(keys);
    Object.seal(pointers);

    const setParentNode = (node: BPlusTreeNode) => {
      parentNode = node;
      return;
    }

    return ({
      isLeafNode,
      keys,
      pointers,
      parentNode,
      setParentNode,
    });
  }

  /**
   * insert a number into a leaf node while maintaining sorted order
   * @param {number} value - The number to insert
   * @param {BPlusTreeNode} targetNode - the node to insert into
   */
  const insertInLeaf = (value: number, keys: (number | null)[]): void => {
    if (keys[0] && value < keys[0]) {
      keys = fixedInsert<typeof keys[0]>(keys, value);
    } else {
      const targetIndex = keys.findIndex((key: number | null) => key && value <= key);
      keys.splice(targetIndex + 1, 1, value);
    }
  }

  /* insert into the parent node of the nodes that were split */
  const insertInParent = (node: BPlusTreeNode, key: number, newNode: BPlusTreeNode): void => {
    if (node.parentNode == null) {
      const newRoot = BPlusTreeNodeFactory(false);
      newRoot.keys[0] = key;
      newRoot.pointers.splice(0, 2, node, newNode);
      return
    }

    const parentNode = node.parentNode;
    let pointerCount = 0;
    parentNode.pointers.forEach((element) => {
      if(element){
        pointerCount++;
      }
    });
    //TODO finish this if block
    if (pointerCount < maxChildren) {
      const nodeIndex = parentNode.pointers.findIndex(element => node === element);
    }
    return
  }

  //TODO finish split case of insert method
  /**
   * inserts a number into the B+tree and update the animation step queue
   * @param {number} value - The number to insert
   */
  const insert = (value: number): void => {
    let targetLeafnode: BPlusTreeNode | null = null; // leaf node to potentially insert value into.
    if (root === null) {
      // (tree is empty) create an empty leaf node, which is also the root.
      targetLeafnode = BPlusTreeNodeFactory(true);
      algoStepQueue.push({ type: algoStepTypeEnum.InitRoot });
    } else {
      // find the leaf node L that should contain key value K.
      const findReturnObj = find(value);
      if (findReturnObj.foundFlag) {
        // The value already exists in the tree don't insert duplicate 
        algoStepQueue.push({ type: algoStepTypeEnum.DuplicateEntry });
        return;
      }
      if (findReturnObj.node) {
        targetLeafnode = findReturnObj.node;
      }
    }
    if (targetLeafnode && targetLeafnode.keys.length < maxChildren - 1) {
      // insert value into target leaf node
      insertInLeaf(value, targetLeafnode.keys);
    } else {// split the leaf node
      const newNode = BPlusTreeNodeFactory(true);

      if (!targetLeafnode) {
        console.error("target leaf node was null");
        return;
      }
      // copy target leaf nodes pointers and keys array
      // only copy up to maxChildren-1 of the pointers array
      // this is done so that later we can add the correct pointers
      // and keys to the correct nodes.
      let pointersCopy = targetLeafnode.pointers.slice(0, targetLeafnode.pointers.length - 1);
      Object.seal(pointersCopy);
      let keysCopy = targetLeafnode.keys.slice();
      Object.seal(keysCopy);

      insertInLeaf(value, keysCopy);

      newNode.pointers[maxChildren-1] = targetLeafnode.pointers[maxChildren-1];
      targetLeafnode.pointers[maxChildren-1] = newNode;

      targetLeafnode.pointers.splice(0, maxChildren - 1, ...makeFilledArray<null>(null, maxChildren - 1));
      targetLeafnode.keys.splice(0, maxChildren - 1, ...makeFilledArray<null>(null, maxChildren - 1));
      const maxDividedBy2 = Math.ceil(maxChildren / 2);
      targetLeafnode.pointers.splice(0, maxDividedBy2, ...pointersCopy.slice(0, maxDividedBy2));
      targetLeafnode.keys.splice(0, maxDividedBy2, ...keysCopy.slice(0, maxDividedBy2));

      let numOfKeys = Math.abs(maxChildren - 1 - maxDividedBy2 + 1);
      newNode.pointers.splice(0, numOfKeys, ...pointersCopy.slice(0, numOfKeys));
      numOfKeys = Math.abs(maxChildren - maxDividedBy2 + 1);
      newNode.keys.splice(0, numOfKeys, ...keysCopy.slice(0, numOfKeys));

      if (newNode.keys[0]) {
        insertInParent(targetLeafnode, newNode.keys[0], newNode);
      } else {
        console.error("first index of new node is null not spliting properly");
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
      let keyIndex = currentNode.keys.findIndex(key => (key && value <= key));
      if (keyIndex == -1) {
        // get last non null pointer in the node
        let lastPointer: BPlusTreeNode | null = null;
        for (let i = currentNode.pointers.length - 1; i >= 0; i--) {
          if (currentNode.pointers[i] != null) {
            lastPointer = currentNode.pointers[i];
            break;
          }
        }

        // insert corresponding step into algoStepQueue
        algoStepQueue.push(
          {
            type: algoStepTypeEnum.SelectChild,
            selectedChildIndex: (currentNode.pointers.length - 1)
          })

        if (lastPointer) {
          currentNode = lastPointer;
        }
      }
      else if (value == currentNode.keys[keyIndex]) {
        const nextNodePointerIndex = keyIndex + 1;
        const nextNode = currentNode.pointers[nextNodePointerIndex]
        if (nextNode != null) {
          currentNode = nextNode;
        }
        algoStepQueue.push(
          {
            type: algoStepTypeEnum.SelectChild,
            selectedChildIndex: (nextNodePointerIndex)
          })
      }
      else {
        const nextNode = currentNode.pointers[keyIndex]
        if (nextNode != null) {
          currentNode = nextNode;
        }
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
