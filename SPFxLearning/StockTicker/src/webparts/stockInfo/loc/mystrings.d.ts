declare interface IStockInfoWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  Stock: string;
  Dimension: string;
  Region: string;
  Lang: string;
  ErrorSelectStock: string;
}

declare module 'StockInfoWebPartStrings' {
  const strings: IStockInfoWebPartStrings;
  export = strings;
}
