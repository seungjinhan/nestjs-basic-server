import {
  createCipheriv,
  createHash,
  randomBytes,
  createDecipheriv,
} from 'crypto';
import * as bcrypt from 'bcrypt';

const alg = 'aes-256-ctr';
let key = 'likealocalsuccess';
key = createHash('sha256').update(String(key)).digest('base64').substr(0, 32);

/**
 * 암호화
 * @param text
 * @returns
 */
export const encryptData = async (data) => {
  const iv = randomBytes(16);
  const cipher = createCipheriv(alg, key, iv);
  const result = Buffer.concat([iv, cipher.update(data), cipher.final()]);
  return result;
};

/**
 * 복호화
 * @param text
 * @returns
 */
export const decryptData = async (data) => {
  const iv = data.slice(0, 16);
  data = data.slice(16);
  const decipher = createDecipheriv(alg, key, iv);
  const result = Buffer.concat([decipher.update(data), decipher.final()]);
  return result.toString();
};

/**
 * 단방향 암호화
 * @param data
 * @returns
 */
export const bcryptData = async (data) => {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(data, saltOrRounds);
  return hash;
};

/**
 * 암호화 데이터 비교
 * @param hash 암호화데이터
 * @param data 원본데이터
 * @returns
 */
export const compareBcryptData = async (hash, data) => {
  return await bcrypt.compare(data, hash);
};
