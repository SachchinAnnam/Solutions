declare interface IPersonalemailWebPartStrings {
  Error: string;
  Loading: string;
  NewEmail:string;
  NoMessages: string;
  NrOfMessagesToShow: string;
  PropertyPaneDescription: string;
  ShowInboxOnly: string;
  ShowInboxOnlyCallout: string;
  ViewAll: string;
}

declare module 'PersonalemailWebPartStrings' {
  const strings: IPersonalemailWebPartStrings;
  export = strings;
}
