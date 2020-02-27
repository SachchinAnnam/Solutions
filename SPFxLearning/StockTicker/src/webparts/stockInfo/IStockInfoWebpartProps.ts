import { IPropertyFieldDimension } from "sp-client-custom-fields/lib/PropertyFieldDimensionPicker";

export interface IStockInfoWebpartProps{
  stock: string;
  lang: string;
  region: string;
  dimension: IPropertyFieldDimension;
}
