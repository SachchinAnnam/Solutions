import { SPHttpClient } from '@microsoft/sp-http';

export interface IStandexCommunityGalleryProps {
  description: string;
  libName: string;
  spHttpClient: SPHttpClient;
  siteUrl: string;
}
