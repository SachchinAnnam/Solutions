declare interface IStockInfoWebPartStrings {
  PropertyPaneDescription: string;
  DescriptionFieldLabel: string;
  PropertyPaneDescription: string;
  BasicGroupName: string;
  StockSymbolFieldLabel: string;
  AutoRefreshFieldLabel: string;
  ListNameFieldLabel:string;
  DisplayNameFieldLabel:string;
  DemoFieldLabel: string;

  // Placeholder labels and strings
  PlaceholderIconName: string;
  PlaceholderIconText: string;
  PlaceholderDescription: string;
  PlaceholderButtonLabel: string;

  // UI labels and strings
  LoadingDataLabel: string;
  NoDataForStockSymbol: string;
  NoAPIKeyInTenantProperties: string;
}

declare module 'StockInfoWebPartStrings' {
  const strings: IStockInfoWebPartStrings;
  export = strings;
}
