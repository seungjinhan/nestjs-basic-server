import Security from '../../src/libs/utils/security';

describe('보안 테스트', () => {
  test('양방향 암호화 비교', async () => {
    const txt = 'password';
    const encryptTxt = await Security.encryptData(txt);
    const decipherTxt = await Security.decryptData(encryptTxt);
    expect(decipherTxt).toBe(txt);
  });
  test('단방향 암호화 비교', async () => {
    const txt = 'password';
    const hash = await Security.bcryptData(txt);
    const res = await Security.compareBcryptData(hash, txt);
    expect(res).toBeTruthy();
  });
});
