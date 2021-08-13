/* each non leaNodef node in a B+tree other than the root has between n
 * and n/2 children, where n is fixxed for a particular tree; the root
 * has between 2 and n children. */
import { fixedInsert, makeFilledArray } from "./util";

/* A typical node of a B+tree contains up to n-1 search-key values,
 * and n pointers. There search-key values within a node are kept
 * in sorted order. */
export interface BPlusTreeNode {
  isLeafNode: boolean;
  keys: (number | null)[];
  pointers: (BPlusTreeNode | null)[];
  setParentNode: (node: BPlusTreeNode | null) => void;
  getParentNode: () => BPlusTreeNode | null;
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
export interface algoInsertStep extends algoStep {}
export interface algoDeleteStep extends algoStep {}
export type algoQueueElement = algoFindStep | algoInsertStep | algoDeleteStep;

export interface BPlusTree {
  getAlgoStepQueue: () => algoQueueElement[];
  getRoot: () => BPlusTreeRoot;
  setRoot: (newRoot: BPlusTreeRoot) => void;
  maxKeys: number;
  insert: (a: number) => void;
  deleteNum: (num: number) => boolean;
  find: (v: number) => findReturnType;
}

export type findReturnType = { node: BPlusTreeNode | null; foundFlag: boolean };

export const BPlusTreeFactory = (maxKeysValue: number): BPlusTree => {
  const maxKeys = maxKeysValue;
  let root: BPlusTreeRoot = null;
  // store a record of strings that will be used to animate the b+tree later
  const algoStepQueue: algoQueueElement[] = [];

  const getAlgoStepQueue = (): algoQueueElement[] => {
    return algoStepQueue;
  };

  const getRoot = (): BPlusTreeRoot => {
    return root;
  };

  const setRoot = (newRoot: BPlusTreeRoot): void => {
    root = newRoot;
    return;
  };

  const BPlusTreeNodeFactory = (leafValue = false): BPlusTreeNode => {
    let parentNode: BPlusTreeNode | null = null;
    let isLeafNode = leafValue;
    const keys: (number | null)[] = new Array(maxKeys);
    const pointers: (BPlusTreeNode | null)[] = new Array(maxKeys + 1);
    keys.fill(null);
    pointers.fill(null);
    Object.seal(keys);
    Object.seal(pointers);

    const setParentNode = (node: BPlusTreeNode | null): void => {
      parentNode = node;
      return;
    };

    const getParentNode = (): BPlusTreeNode | null => {
      return parentNode;
    };

    return {
      isLeafNode,
      keys,
      pointers,
      setParentNode,
      getParentNode,
    };
  };

  /**
   * insert a number into a leaf node while maintaining sorted order
   * @param {number} value - The number to insert
   * @param {BPlusTreeNode} targetNodeKeys - the node to insert into
   */
  const insertInLeaf = (
    value: number,
    targetNodeKeys: (number | null)[]
  ): void => {
    algoStepQueue.push({ type: algoStepTypeEnum.InsertInLeaf });
    if (
      (targetNodeKeys[0] && value < targetNodeKeys[0]) ||
      targetNodeKeys.filter((x) => x === null).length === maxKeys
    ) {
      targetNodeKeys = fixedInsert<typeof targetNodeKeys[0]>(
        targetNodeKeys,
        value
      );
    } else {
      let targetIndex = 0;
      targetNodeKeys.forEach((key: number | null, index): void => {
        if (key && key <= value) {
          targetIndex = index;
        }
      });
      const deletedNum = targetNodeKeys.splice(targetIndex + 1, 1, value);
      if (targetNodeKeys.length > targetIndex + 2) {
        fixedInsert(targetNodeKeys, deletedNum[0], targetIndex + 2);
      }
    }
  };

  /* insert into the parent node of the nodes that were split */
  const insertInParent = (
    node: BPlusTreeNode,
    key: number,
    newNode: BPlusTreeNode
  ): void => {
    const parentNode = node.getParentNode();
    if (parentNode == null) {
      const newRoot = BPlusTreeNodeFactory(false);
      newRoot.keys[0] = key;
      newRoot.pointers.splice(0, 2, node, newNode);
      root = newRoot;
      node.setParentNode(newRoot);
      newNode.setParentNode(newRoot);
      return;
    }

    let pointerCount = 0;
    parentNode.pointers.forEach((element): void => {
      if (element) {
        pointerCount++;
      }
    });
    const nodeIndex = parentNode.pointers.findIndex(
      (element) => node === element
    );
    if (pointerCount < maxKeys + 1) {
      fixedInsert(parentNode.pointers, newNode, nodeIndex + 1);
      fixedInsert(parentNode.keys, key, nodeIndex);
      newNode.setParentNode(parentNode);
    } else {
      // split
      const keysCopy = makeFixedArray<number>(maxKeys + 1);
      const pointersCopy = makeFixedArray<BPlusTreeNode>(maxKeys + 2);
      keysCopy.splice(0, maxKeys, ...parentNode.keys);
      pointersCopy.splice(0, maxKeys + 1, ...parentNode.pointers);

      fixedInsert(keysCopy, key, nodeIndex);
      fixedInsert(pointersCopy, newNode, nodeIndex + 1);

      parentNode.pointers.splice(
        0,
        maxKeys + 1,
        ...makeFilledArray(null, maxKeys + 1)
      );
      parentNode.keys.splice(0, maxKeys, ...makeFilledArray(null, maxKeys));

      // copy T.P_1 ... T.P_splitPoint into P
      const splitPoint = Math.ceil((maxKeys + 2) / 2) - 1;
      parentNode.pointers.splice(
        0,
        splitPoint + 1,
        ...pointersCopy.slice(0, splitPoint + 1)
      );
      parentNode.keys.splice(0, splitPoint, ...keysCopy.slice(0, splitPoint));

      parentNode.pointers.forEach((node) => {
        if (node) {
          node.setParentNode(parentNode);
        }
      });

      // let K'' = T.K_splitPoint
      const carryUpKey = keysCopy[splitPoint];
      const newParentNode = BPlusTreeNodeFactory(false);

      // copy T.P_splitPoint...T.P_n+1 into P'
      const tmpPointersCopy = pointersCopy.slice(splitPoint + 1);
      const tmpKeysCopy = keysCopy.slice(splitPoint + 1);
      newParentNode.pointers.splice(
        0,
        tmpPointersCopy.length,
        ...tmpPointersCopy
      );
      newParentNode.keys.splice(0, tmpKeysCopy.length, ...tmpKeysCopy);

      newParentNode.pointers.forEach((node): void => {
        if (node) {
          node.setParentNode(newParentNode);
        }
      });

      if (carryUpKey) {
        insertInParent(parentNode, carryUpKey, newParentNode);
      } else {
        console.error("key to insert into parent was null");
      }
    }
    return;
  };

  /**
   * inserts a number into the B+tree and update the animation step queue
   * @param {number} value - The number to insert
   */
  const insert = (value: number): void => {
    let targetLeafNode: BPlusTreeNode | null = null; // leaf node to potentially insert value into.
    if (root === null) {
      // (tree is empty) create an empty leaf node, which is also the root.
      targetLeafNode = BPlusTreeNodeFactory(true);
      root = targetLeafNode;
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
        targetLeafNode = findReturnObj.node;
      }
    }
    if (
      targetLeafNode !== null &&
      targetLeafNode.keys.filter((x) => x !== null).length <= maxKeys - 1
    ) {
      // insert value into target leaf node
      insertInLeaf(value, targetLeafNode.keys);
    } else {
      // split the leaf node
      const newNode = BPlusTreeNodeFactory(true);

      if (!targetLeafNode) {
        console.error("target leaf node was null");
        return;
      }
      // copy target leaf nodes pointers and keys array
      // only copy up to maxKeys-1 of the pointers array
      // this is done so that later we can add the correct pointers
      // and keys to the correct nodes.
      let pointersCopy = targetLeafNode.pointers.slice(
        0,
        targetLeafNode.pointers.length - 1
      );
      pointersCopy[maxKeys] = null;
      Object.seal(pointersCopy);
      let keysCopy = targetLeafNode.keys.slice();
      keysCopy[maxKeys] = null;

      insertInLeaf(value, keysCopy);

      newNode.pointers[maxKeys] = targetLeafNode.pointers[maxKeys];
      targetLeafNode.pointers[maxKeys] = newNode;

      // erase P_0 through K_maxKeys from targetLeafNode
      targetLeafNode.pointers.splice(
        0,
        maxKeys,
        ...makeFilledArray(null, maxKeys)
      );
      targetLeafNode.keys.splice(0, maxKeys, ...makeFilledArray(null, maxKeys));

      // copy T.P_1 though T.P_n/2 from T into L starting at L.P_1
      const maxDividedBy2 = Math.ceil((maxKeys + 1) / 2);
      targetLeafNode.pointers.splice(
        0,
        maxDividedBy2,
        ...pointersCopy.slice(0, maxDividedBy2)
      );
      targetLeafNode.keys.splice(
        0,
        maxDividedBy2,
        ...keysCopy.slice(0, maxDividedBy2)
      );

      const tmpNodePointers = pointersCopy.slice(maxDividedBy2);
      const tmpNodeKeys = keysCopy.slice(maxDividedBy2);
      newNode.pointers.splice(0, tmpNodePointers.length, ...tmpNodePointers);
      newNode.keys.splice(0, tmpNodeKeys.length, ...tmpNodeKeys);

      if (newNode.keys[0]) {
        insertInParent(targetLeafNode, newNode.keys[0], newNode);
      } else {
        console.error("first index of new node is null not spliting properly");
      }
    }
    return;
  };

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
      let keyIndex = currentNode.keys.findIndex((key) => key && value <= key);
      if (keyIndex == -1) {
        let selectedChildIndexValue = 0;
        // get last non null pointer in the node
        let lastPointer: BPlusTreeNode | null = null;
        for (let i = currentNode.pointers.length - 1; i >= 0; i--) {
          if (currentNode.pointers[i] != null) {
            lastPointer = currentNode.pointers[i];
            selectedChildIndexValue = i;
            break;
          }
        }

        // insert corresponding step into algoStepQueue
        algoStepQueue.push({
          type: algoStepTypeEnum.SelectChild,
          selectedChildIndex: selectedChildIndexValue,
        });

        if (lastPointer) {
          currentNode = lastPointer;
        }
      } else if (value == currentNode.keys[keyIndex]) {
        const nextNodePointerIndex = keyIndex + 1;
        const nextNode = currentNode.pointers[nextNodePointerIndex];
        if (nextNode != null) {
          currentNode = nextNode;
        }
        algoStepQueue.push({
          type: algoStepTypeEnum.SelectChild,
          selectedChildIndex: nextNodePointerIndex,
        });
      } else {
        const nextNode = currentNode.pointers[keyIndex];
        if (nextNode != null) {
          currentNode = nextNode;
        }
        algoStepQueue.push({
          type: algoStepTypeEnum.SelectChild,
          selectedChildIndex: keyIndex,
        });
      }
    }
    // C is leaf Node
    const keyIndex = currentNode.keys.findIndex((key) => value == key);
    if (keyIndex != -1) {
      algoStepQueue.push({
        type: algoStepTypeEnum.Found,
        foundElementIndex: keyIndex,
      });
      return { node: currentNode, foundFlag: true }; // return pointer to actual data record
    } else {
      algoStepQueue.push({
        type: algoStepTypeEnum.NotFound,
      });
      return { node: currentNode, foundFlag: false }; // no record with key value *value* exists
      // return the current node anyways because it is needed for
    }
  };

  /**
   * deletes a number in a BPlusTree
   * @param {number} value - The number to delete
   * @return {boolean} deletedFlag - Wether or not number was deleted
   * true if number was deleted false if it was not found.
   */
  const deleteNum = (numToDelete: number) => {
    const foundNode = find(numToDelete);
    if (foundNode.foundFlag && foundNode.node) {
      deleteNumEntry(numToDelete, foundNode.node);
      return true;
    }
    return false;
  };

  //TODO implement most basic case of this function
  const deleteNumEntry = (numToDelete: number, node: BPlusTreeNode): void => {
    const numToDeleteIndex = node.keys.findIndex(
      (element) => element == numToDelete
    );
    node.keys[numToDeleteIndex] = null;
    node.pointers[numToDeleteIndex+1] = null;
    // Base case node is root and has only one child.
    if (
      node.getParentNode() == null &&
      node.pointers.filter((element) => element != null).length == 1
    ) {
      const indexOfChild = node.pointers.findIndex(
        (element) => element != null
      );
      node.pointers[indexOfChild]!.setParentNode(null);
      setRoot(node.pointers[indexOfChild]);
    } else if (
      (node.isLeafNode &&
        node.keys.filter((key) => key != null).length <
          Math.ceil(maxKeys / 2)) ||
      (!node.isLeafNode &&
        node.pointers.filter((pointer) => pointer != null).length <
          Math.ceil((maxKeys + 1) / 2))
    ) {
      // this if block handles the case where N has too few values/pointers.
      const parentNode = node.getParentNode();
      //TODO finish this bit
      if (parentNode) {
        let nodeIndex = parentNode.pointers.indexOf(node);
        let borrowNodeIndex = 0;
        let borrowNode: BPlusTreeNode | null = null;
        if (nodeIndex - 1 >= 0 && parentNode.pointers[nodeIndex - 1] != null) {
          borrowNodeIndex = nodeIndex - 1;
          borrowNode = parentNode.pointers[nodeIndex - 1];
        } else {
          borrowNodeIndex = nodeIndex + 1;
          borrowNode = parentNode.pointers[nodeIndex + 1];
        }

        // borrow value is the value between pointers node and borrowNode in parent(node)
        let borrowValue = 0;
        if (borrowNodeIndex < nodeIndex && parentNode.keys[borrowNodeIndex]) {
          borrowValue = parentNode.keys[borrowNodeIndex]!;
        } else if (parentNode.keys[nodeIndex]) {
          borrowValue = parentNode.keys[nodeIndex]!;
        } else {
          console.error("parent.keys[index] was null");
        }

        // handle case where entries in node and borrow node can fit in a single node.
        if (
          borrowNode &&
          node.keys.filter((value) => value != null).length +
            borrowNode.keys.filter((value) => value != null).length <=
            maxKeys
        ) {
          // block coalesces two nodes
          //TODO finish this block
          if (nodeIndex < borrowNodeIndex) {
            const tmp = borrowNode;
            borrowNode = node;
            node = tmp;
          }
          if (!node.isLeafNode) {
            fixedInsert(
              borrowNode.keys,
              borrowValue,
              borrowNode.keys.findIndex((element) => element == null)
            );
            appendAllPointersValues(node, borrowNode);
          } else {
            appendAllPointersValues(node, borrowNode);
            borrowNode.pointers[maxKeys] = node.pointers[maxKeys];
          }
          //delete_entry(parent(N), K', N); delete node N
          if(node.getParentNode() != null){
            deleteNumEntry(borrowValue, node.getParentNode() as BPlusTreeNode);
          }else{
            console.error("node parent was null");
          }
        } else {
          // redistribution: borrow an entry from N'
        }
      }
    }
  };

  const newBPlusTree = {
    getAlgoStepQueue,
    getRoot,
    setRoot,
    maxKeys,
    insert,
    deleteNum,
    find,
  };

  return newBPlusTree;
};

/* utility functions */

/* make copy fixed length array */
export function makeFixedArray<ElementType>(
  length: number
): (ElementType | null)[] {
  const arrCopy: (ElementType | null)[] = new Array(length);
  arrCopy.fill(null);
  Object.seal(arrCopy);
  return arrCopy;
}

/* append all pointers and values of one node to another*/
export const appendAllPointersValues = (
  node: BPlusTreeNode,
  nodePrime: BPlusTreeNode
) => {
  let startIndex = nodePrime.keys.findIndex((element) => element == null);
  node.keys
    .filter((value) => value != null)
    .forEach((value, index) =>
      fixedInsert(nodePrime!.keys, value, startIndex + index)
    );
  startIndex = nodePrime.pointers.findIndex((element) => element == null);
  node.pointers
    .filter((value) => value != null)
    .forEach((value, index) =>
      fixedInsert(nodePrime!.pointers, value, startIndex + index)
    );
};
