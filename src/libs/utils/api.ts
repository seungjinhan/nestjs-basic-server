export interface APIReturnType {
  ok: boolean;
  data: any;
}
export const makeResponse = (ok: boolean, data: any = null): APIReturnType => {
  return { ok, data };
};
