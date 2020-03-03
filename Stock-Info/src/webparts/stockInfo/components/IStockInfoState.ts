import { IStockInfoData } from "./IStockInfoData";

export interface IStockInfoState {
  // used to show the Spinner while loading stock information
  loading: boolean;
  // the real stock information data
  stockInfo?: IStockInfoData;
}
