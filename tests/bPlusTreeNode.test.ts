import { BPlusTreeNodeFactory } from '../src/ts/bPlusTreeAlgo';
import { expect } from 'chai';

describe('BPlusTreeNodeFactory', (): void => { // the tests container
  it('should return empy BTreeNode',
    (): void => {
      /* detect retina */
      const emptyNode = BPlusTreeNodeFactory(true);
      expect(emptyNode).to.include({
        leafNode: true,
      });
      expect(emptyNode).to.have.property('keys').eql([]);
      expect(emptyNode).to.have.property('pointers').eql([]);
    });
});
