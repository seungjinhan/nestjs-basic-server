export interface APIReturnType {
  ok: boolean;
  data: any;
}
export const makeResponse = (ok: boolean, data: any): APIReturnType => {
  return { ok, data };
};
