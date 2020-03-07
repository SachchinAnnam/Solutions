import { IStockInfoData } from "./IStockInfoData";

export interface IStockInfoState {
  // used to show the Spinner while loading stock information
  loading: boolean;
  title:string;
  // the real stock information data
  stockInfo?: IStockInfoData;
}
