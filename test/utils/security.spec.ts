import {
  decryptData,
  encryptData,
  bcryptData,
  compareBcryptData,
} from '../../src/utils/security';

describe('보안 테스트', () => {
  test('양방향 암호화 비교', async () => {
    const txt = 'password';
    const encryptTxt = await encryptData(txt);
    const decipherTxt = await decryptData(encryptTxt);
    expect(decipherTxt).toBe(txt);
  });
  test('단방향 암호화 비교', async () => {
    const txt = 'password';
    const hash = await bcryptData(txt);
    const res = await compareBcryptData(hash, txt);
    expect(res).toBeTruthy();
  });
});
