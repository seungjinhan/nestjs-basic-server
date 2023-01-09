import {
  createCipheriv,
  createHash,
  randomBytes,
  createDecipheriv,
} from 'crypto';
import * as bcrypt from 'bcrypt';

export const Security = {
  alg: 'aes-256-ctr',

  _key: 'likealocalkeysecury',

  key: createHash('sha256')
    .update(String('key'))
    .digest('base64')
    .substr(0, 32),

  /**
   * 암호화
   * @param text
   * @returns
   */
  encryptData: async (data): Promise<Buffer> => {
    const iv = randomBytes(16);
    const cipher = createCipheriv(Security.alg, Security.key, iv);
    const result = Buffer.concat([iv, cipher.update(data), cipher.final()]);
    return result;
  },

  /**
   * 복호화
   * @param text
   * @returns
   */
  decryptData: async (_data): Promise<string> => {
    const iv = _data.slice(0, 16);
    const data = _data.slice(16);
    const decipher = createDecipheriv(Security.alg, Security.key, iv),
      result = Buffer.concat([decipher.update(data), decipher.final()]);
    return result.toString();
  },

  /**
   * 단방향 암호화
   * @param data
   * @returns
   */
  bcryptData: async (data: string): Promise<string> => {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(data, saltOrRounds);
    return hash;
  },

  /**
   * 암호화 데이터 비교
   * @param hash 암호화데이터
   * @param data 원본데이터
   * @returns
   */
  compareBcryptData: async (hash, data): Promise<boolean> => {
    return await bcrypt.compare(data, hash);
  },

  /**
   * 랜덤키 만들기
   */
  makeKey: async (data): Promise<string> => {
    const key = await createHash('sha256')
      .update(String(data))
      .digest('base64')
      .substr(0, 38);
    return key.replace(/\//g, '');
  },
};
