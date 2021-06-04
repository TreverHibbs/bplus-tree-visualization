import { BPlusTreeFactory } from '../src/ts/bPlusTreeAlgo';
import { expect } from 'chai';

describe('BPlusTreeFactory', () => { // the tests container
  it(`should return BPlusTree object with null root 
      and maxChildren set`, (): void => {
    /* detect retina */
    expect(BPlusTreeFactory(2)).to.include({ root: null, maxChildren: 2 });
  });
});
