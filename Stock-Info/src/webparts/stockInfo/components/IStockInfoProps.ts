import { HttpClient } from "@microsoft/sp-http";
import { IAVResults } from "./AlphaVantageResults";

export interface IStockInfoProps {
  description: string;
  stockSymbol: string;
  title:string;
  demo: boolean;
  apiKey?: string;
  needsConfiguration: boolean;
  httpClient: HttpClient;
  configureHandler: () => void;
  errorHandler: (errorMessage: string) => void;
}
