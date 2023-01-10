export const ObjectUtil = {
  isNotEmpty: (obj: any) => {
    if (obj === undefined || obj === null) {
      return false;
    }
    return true;
  },
};
