import { SPHttpClient } from "@microsoft/sp-http";
import { DisplayMode } from '@microsoft/sp-core-library';

export interface IGetMySitesProps {
  description: string;
  siteurl:string;
  spHttpClient:SPHttpClient;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
}
