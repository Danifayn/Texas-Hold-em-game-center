/// <reference path="../typings/globals/jasmine/index.d.ts" />
import { createExtractor } from './service';

describe("Extractor", function() {
    it('should retreive params correctly',()=>{
        let params = {a: 5, b: 'a string', c: true};
        let extractor = createExtractor(params);

        expect(extractor.number('a')).toBe(5);
        expect(extractor.string('b')).toBe('a string');
        expect(extractor.boolean('c')).toBe(true);

        expect(() => extractor.number('b')).toThrowError();
    })
});


