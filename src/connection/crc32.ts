import crc from 'crc';

type int = number;
type byte = number;

export const intToByteArray = (i: int): byte[] => {
    return [((-16777216 & i) >> 24), ((16711680 & i) >> 16), ((65280 & i) >> 8), ((i & 255) >> 0)];
}

function reverse32(i: int) {
    const i2 = ((i & 1431655765) << 1) | ((i >> 1) & 1431655765);
    const i3 = ((i2 & 858993459) << 2) | ((i2 >> 2) & 858993459);
    const i4 = ((i3 & 252645135) << 4) | ((i3 >> 4) & 252645135);
    const i5 = ((i4 & 16711935) << 8) | ((i4 >> 8) & 16711935);
    return ((i5 & 65535) << 16) | ((i5 >> 16) & 65535);
}

function reverse8(i: int): int {
    const i2 = ((i & 15) << 4) | ((i & 240) >> 4);
    const i3 = ((i2 & 51) << 2) | ((i2 & 204) >> 2);
    return ((i3 & 85) << 1) | ((i3 & 170) >> 1);
}

function crc32_table(iArr: int[]) {
    const i = crc.crc32(Buffer.from(iArr.map(reverse8))) ^ -1
    const iba = intToByteArray(~reverse32(i));

    const bArr = new Array(4);
    for (let i2 = 0; i2 < 4; i2++) {
        bArr[i2] = iba[3 - i2];
    }
    return bArr;
}

export function crc32(bArr: byte[]): byte[] {
  let length = bArr.length;
  if (length % 4 != 0) {
      length += 4 - (bArr.length % 4);
  }
  const iArr = new Array(length);

  // read bArr in 4 part chunks, reversing each chunk, padding with 255

  let i = 0;
  for (let i2 = 0; i2 < length; i2 += 4) { // in 4 part chunks

      for (let i3 = 3; i3 >= 0; i3--) { // reading the chunk backwards
          let i4 = i2 + i3; // absolute idx of item
          iArr[i] = i4 < bArr.length ? bArr[i4] : 255; // pad with 255
          i++;
      }
  }

  return crc32_table(iArr);
}
