export enum ERowVariant {
  REGULAR = "regular",
  HUGGING = "hugging",
}
export type TRowVariant = ERowVariant.REGULAR | ERowVariant.HUGGING;
export type IRowProperties = Record<string, string>;
export const rowStyle: IRowProperties = {
  [ERowVariant.REGULAR]: "px-page-x",
  [ERowVariant.HUGGING]: "px-0",
};
