import { HttpClient } from "@microsoft/sp-http";

export interface IStockInfoProps {
  description: string;
  stockSymbol: string;
  demo: boolean;
  autoRefresh: boolean;
  apiKey?: string;
  needsConfiguration: boolean;
  httpClient: HttpClient;
  configureHandler: () => void;
  errorHandler: (errorMessage: string) => void;
}
