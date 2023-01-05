import * as moment from 'moment';

export enum DateAddType {
  years = 'y',
  quarters = 'Q',
  months = 'M',
  weeks = 'w',
  days = 'd',
  hours = 'h',
  minutes = 'm',
  seconds = 's',
  milliseconds = 'ms',
}

const MomentDate = {
  date: (day = ''): moment.Moment => {
    return moment(day);
  },

  /**
   *
   * 날짜 포멧
   *
   * YYYY	    2014	4 or 2 digit year. Note: Only 4 digit can be parsed on strict mode
   * YY	        14	2 digit year
   * Y	        -25	Year with any number of digits and sign
   * Q	        1..4	Quarter of year. Sets month to first month in quarter.
   * M MM	    1..12	Month number
   * MMM MMMM	Jan..December	Month name in locale set by moment.locale()
   * D DD	    1..31	Day of month
   * Do	        1st..31st	Day of month with ordinal
   * DDD DDDD	1..365	Day of year
   * X	        1410715640.579	Unix timestamp
   * x	        1410715640579	Unix ms timestamp
   *
   * 현재 시간
   *
   * @param format 포멧
   * @returns
   */
  nowString: (format: string): string => {
    return moment().format(format);
  },

  /**
   * 날짜객체 반환
   * @param dateString 날짜 스트링문자열
   * @returns
   */
  now: (): moment.Moment => {
    return moment();
  },

  /**
   * 현재 시간 기준으로 더하기
   * @param num
   * @param type
   * @returns
   */
  add: (num: number, type: DateAddType): moment.Moment => {
    return moment().add(num, type);
  },

  /**
   * 기준날짜에서 더하기
   * @param day 기준날짜
   * @param num 추가숫자
   * @param type 타입
   * @returns
   */
  addFromDate: (
    day: moment.Moment,
    num: number,
    type: DateAddType,
  ): moment.Moment => {
    return moment(day).add(num, type);
  },
};

export default MomentDate;

// export const date = (day = '') => {
//   return moment(day);
// };
// /**
//  *
//  * 날짜 포멧
//  *
//  * YYYY	    2014	4 or 2 digit year. Note: Only 4 digit can be parsed on strict mode
//  * YY	        14	2 digit year
//  * Y	        -25	Year with any number of digits and sign
//  * Q	        1..4	Quarter of year. Sets month to first month in quarter.
//  * M MM	    1..12	Month number
//  * MMM MMMM	Jan..December	Month name in locale set by moment.locale()
//  * D DD	    1..31	Day of month
//  * Do	        1st..31st	Day of month with ordinal
//  * DDD DDDD	1..365	Day of year
//  * X	        1410715640.579	Unix timestamp
//  * x	        1410715640579	Unix ms timestamp
//  *
//  * 현재 시간
//  *
//  * @param format 포멧
//  * @returns
//  */
// export const nowString = (format: string) => {
//   return moment().format(format);
// };

// /**
//  * 날짜객체 반환
//  * @param dateString 날짜 스트링문자열
//  * @returns
//  */
// export const now = () => {
//   return moment();
// };

// /**
//  * 현재 시간 기준으로 더하기
//  * @param num
//  * @param type
//  * @returns
//  */
// export const add = (num: number, type: DateAddType) => {
//   return moment().add(num, type);
// };

// /**
//  * 기준날짜에서 더하기
//  * @param day 기준날짜
//  * @param num 추가숫자
//  * @param type 타입
//  * @returns
//  */
// export const addFromDate = (
//   day: moment.Moment,
//   num: number,
//   type: DateAddType,
// ) => {
//   return moment(day).add(num, type);
// };

// // interface RelativeTimeType {
// //   year_ago;
// //   day_ago;
// //   hour_ago;
// //   hour_in;
// //   hour
// // }
// // export const relativeTime = (type: RelativeTimeType, fromYYYYMMDD?: string) => {
// //   let res: string;
// //   switch (type) {
// //     case type.year:
// //       res = moment(fromYYYYMMDD, 'YYYYMMDD').fromNow();
// //       break;
// //     case type.day:
// //       res = moment().startOf('day').fromNow();
// //   }
// // };
