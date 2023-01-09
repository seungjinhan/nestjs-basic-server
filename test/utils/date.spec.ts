import { DateAddType, MomentDate } from '../../src/libs/utils/date';

describe('Date 테스트', () => {
  test('날짜 객체 만들기', () => {
    const n = MomentDate.date('2023-01-05');
    expect(n.format('YYYYMMDD')).toBe('20230105');
  });
  test('현재 시간', () => {
    const n = MomentDate.nowString('YYYYMMDD');
    expect(Number.parseInt(n.slice(-2)) + '').toBe(
      new Date().getDate().toString(),
    );
  });
  test('현재 시간 폴더', () => {
    const n = MomentDate.nowString('YYYY/MM/DD');
    console.log(n);
    expect(Number.parseInt(n.slice(-2)) + '').toBe(
      new Date().getDate().toString(),
    );
  });
  test('날짜 더하기', () => {
    const res = MomentDate.add(3, DateAddType.days);
    const n = MomentDate.nowString('YYYYMMDD');
    console.log(n, res.format('YYYYMMDD'));
    expect(true).toBeTruthy;
  });

  test('날짜 더하기', () => {
    const res = MomentDate.addFromDate(
      MomentDate.date('2023-01-01'),
      10,
      DateAddType.days,
    );
    expect(res.format('YYYYMMDD')).toBe(
      MomentDate.date('2023-01-11').format('YYYYMMDD'),
    );
  });
  test('날짜 빼기', () => {
    const res = MomentDate.addFromDate(
      MomentDate.date('2023-01-10'),
      -2,
      DateAddType.days,
    );
    expect(res.format('YYYYMMDD')).toBe(
      MomentDate.date('2023-01-08').format('YYYYMMDD'),
    );
  });
});
