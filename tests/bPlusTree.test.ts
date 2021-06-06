import { BPlusTreeFactory } from '../src/ts/bPlusTreeAlgo';
import { expect } from 'chai';

describe('BPlusTree', (): void => {
  const myBplusTree = BPlusTreeFactory(2);
  describe('BPlusTreeFactory', () => { // the tests container
    it('should return BPlusTree object with null root and maxChildren set',
      (): void => {
        /* detect retina */
        expect(myBplusTree).to.include({ root: null, maxChildren: 2 });
      });
  });

  describe('BPlusTree insert func', (): void => {
    myBplusTree.insert(2);
    it('should initialize the root when first number is inserted',
      (): void => {
        console.log(myBplusTree.root, 'root in tes');
        expect(myBplusTree.root).to.not.be.a('null');
        expect(myBplusTree.root).to.have.property('keys').eql([2]);
        expect(myBplusTree.root).to.have.property('pointers').eql([]);
        expect(myBplusTree.root).to.have.property('leafNode').eql(true);
      });

    let numbersToInsert = [3, 4, 6];
    for (let num of numbersToInsert) {
      myBplusTree.insert(num);
    }
    it('should insert series of numbers',
      (): void => {
        expect(myBplusTree.root).to.eql({
          leafNode: false,
          keys: [3, 4],
          pointers: [
            { leafNode: true, keys: [2], pointers: [] },
            { leafNode: true, keys: [3], pointers: [] },
            { leafNode: true, keys: [4, 6], pointers: [] }
          ]
        });
      });
    for (let num of [10, 11, 15]) {
      myBplusTree.insert(num);
    }

    it('should insert bigger series of numbers',
      (): void => {
        expect(myBplusTree.root).to.eql({
          leafNode: false,
          keys: [4, 10],
          pointers: [
            {
              leafNode: false,
              keys: [3],
              pointers: [
                {
                  leafNode: true,
                  keys: [2],
                  pointers: []
                },
                {
                  leafNode: true,
                  keys: [3],
                  pointers: []
                }
              ]
            },
            {
              leafNode: false,
              keys: [6],
              pointers: [
                {
                  leafNode: true,
                  keys: [4],
                  pointers: []
                },
                {
                  leafNode: true,
                  keys: [6],
                  pointers: []
                }
              ]
            },
            {
              leafNode: false,
              keys: [11],
              pointers: [
                {
                  leafNode: true,
                  keys: [10],
                  pointers: []
                },
                {
                  leafNode: true,
                  keys: [11, 15],
                  pointers: []
                }
              ]
            }
          ]
        });
      });

    it('should insert series of numbers with n = 3',
      (): void => {
        const myN3Tree = BPlusTreeFactory(3);
        let numbersToInsert = [2, 5, 10, 4];
        for (let num of numbersToInsert) {
          myN3Tree.insert(num);
        }
        expect(myN3Tree.root).to.eql({
          leafNode: false,
          keys: [5],
          pointers: [
            { leafNode: true, keys: [2, 4], pointers: [] },
            { leafNode: true, keys: [5, 10], pointers: [] },
          ]
        });
      });
  });
});
