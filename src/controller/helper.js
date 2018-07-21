import { Buffer } from "buffer";

export function b64Encode(str) {
  return Buffer.from(str).toString('base64');
}

export function b64Decode(encodedStr) {
  return Buffer.from(encodedStr, 'base64').toString();
}
