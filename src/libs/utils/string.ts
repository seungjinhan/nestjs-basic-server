export const StringUtil = {
  isNotEmpty: (str: string) => {
    if (str === undefined || str === null || str.trim() === '') {
      return false;
    }
    return true;
  },
};
