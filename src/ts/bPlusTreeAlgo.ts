/* each non leaf node in a B+tree other than the root has between n
 * and n/2 children, where n is fixxed for a particular tree; the root
 * has between 2 and n children. */

/* A typical node of a B+tree contains up to n-1 search-key values,
 * and n pointers. There search-key values within a node are kept
 * in sorted order. */
export interface BPlusTreeNode {
  leafNode: boolean;
  keys: number[];
  pointers: BPlusTreeNode[];
}

export const BPlusTreeNodeFactory = (leafValue: boolean): BPlusTreeNode => {
  const leafNode = leafValue;
  const keys: number[] = [];
  const pointers: BPlusTreeNode[] = [];

  return ({
    leafNode,
    keys,
    pointers
  });
}


export interface BPlusTree {
  root: BPlusTreeNode | null;
  maxChildren: number;
  insert: (a: number) => void;
}

export const BPlusTreeFactory = (maxChildrenValue: number): BPlusTree => {

  const maxChildren = maxChildrenValue;
  let root: BPlusTreeNode | null = null;

  const insert = (value: number): void => {
    if (root === null) {
      root = BPlusTreeNodeFactory(true);
      root.keys.push(value);
      console.debug('running insert if', root);
    }
    return;
  }

  const newBPlusTree = {
    root,
    maxChildren,
    insert
  };

  return (newBPlusTree);
}
