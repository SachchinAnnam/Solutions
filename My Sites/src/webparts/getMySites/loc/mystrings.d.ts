declare interface IGetMySitesWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'GetMySitesWebPartStrings' {
  const strings: IGetMySitesWebPartStrings;
  export = strings;
}
