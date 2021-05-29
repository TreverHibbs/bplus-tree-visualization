import { hello } from '../src/hello'; // this will be your custom import
import { expect } from 'chai';

describe('hello world test', () => { // the tests container
    it('checking return', () => { // the single test
                /* detect retina */
        expect(hello()).to.be.false; // Do I need to explain anything? It's like writing in English!
    });
});
