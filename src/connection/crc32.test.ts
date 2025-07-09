import { describe, it } from "node:test";
import { crc32 } from "./crc32";
import assert from "node:assert";

describe('crc32', () => {
    it('should generate the correct output - 1', () => {
        const output = [ 212, 246, 230, 120 ]
        
        assert.deepEqual(crc32([ 67, 84, 1, 0, 0 ]),  output)
    })
    it('should generate the correct output - 2', () => {
        assert.deepEqual(crc32([ 67, 84, 3, 0, 0 ]), [ 246, 38, 72, -26 ])
    })
    it('should generate the correct output - 3', () => {
        const input = [67,84,5,-92,0,6,98,111,105,105,105,105,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,13,116,104,101,44,80,97,115,115,119,111,114,100,33,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,20,104,116,116,112,58,47,47,49,48,46,48,46,48,46,49,58,51,48,48,48,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        
        assert.deepEqual(crc32(input), [ 27, 19, 61, 36 ])
    })
})