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

export interface BPlusTree {
  root: BPlusTreeNode | null;
  maxChildren: number;
}

export const BPlusTreeFactory = (maxChildrenValue: number): BPlusTree => {
  return({ root: null, maxChildren: maxChildrenValue });
}
