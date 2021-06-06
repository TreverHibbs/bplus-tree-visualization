import { BPlusTreeNodeFactory } from '../src/ts/bPlusTreeAlgo';
import { expect } from 'chai';

describe('BPlusTreeNodeFactory', (): void => { // the tests container
  it('should return node with single key value and set leaf value when single value is passed',
    (): void => {
      /* detect retina */
      const myNode = BPlusTreeNodeFactory(true);
      expect(myNode).to.include({
        leafNode: true,
      });
      expect(myNode).to.have.property('keys').eql([2]);
      expect(myNode).to.have.property('pointers').eql([]);
    });
});
