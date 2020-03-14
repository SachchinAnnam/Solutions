import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

import { HttpClient,HttpClientResponse,SPHttpClient,SPHttpClientResponse} from "@microsoft/sp-http";
import { IAVResults } from "./components/AlphaVantageResults";
// import {
//   IPropertyPaneConfiguration,
//   PropertyPaneTextField
// } from '@microsoft/sp-property-pane';

import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import { DisplayMode } from '@microsoft/sp-core-library';


import * as strings from 'StockInfoWebPartStrings';
import StockInfo from './components/StockInfo';
import { IStockInfoProps } from './components/IStockInfoProps';
export interface IStockInfoWebPartProps {
  description: string;
  demo: boolean;
  stockSymbol: string;
  autoRefresh: boolean;
  stockDisplayName:string;
}


// import { sp, StorageEntity } from "@pnp/sp";
//import "@pnp/sp/webs";
const apiKey:string = "E2IJ2Z352MX8G0E4";

let stockResults : IAVResults = null;

export default class StockInfoWebPart extends BaseClientSideWebPart<IStockInfoWebPartProps> {


  public async onInit(): Promise<void> {
    await super.onInit();
  }

  public async render(): Promise<void> {

    //const apiKey:string = await this.getApiKey();
    const element: React.ReactElement<IStockInfoProps > = React.createElement(
      StockInfo,
      {
        description: this.properties.description,
        demo: this.properties.demo,
        stockSymbol: this.properties.stockSymbol,
        title:this.properties.stockDisplayName,
        apiKey: apiKey,
        siteURL:this.context.pageContext.site.absoluteUrl,
        needsConfiguration: this.needsConfiguration(),
        httpClient: this.context.httpClient,
        configureHandler: () => {
          this.context.propertyPane.open();
        },
        errorHandler: (errorMessage: string) => {
          if (this.displayMode === DisplayMode.Edit) {
            this.context.statusRenderer.renderError(this.domElement, errorMessage);
          } else {
            // nothing to do, if we are not in edit Mode
          }
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getItemEndPoint():string{
     let endPoint :string = `${this.context.pageContext.site.absoluteUrl}/_api/web/lists/getbytitle('StockInfo')/items?$select=*&$top=1`;
     return endPoint;
  }

 protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneToggle('demo', {
                  label: strings.DemoFieldLabel
                }),
                PropertyPaneTextField('stockSymbol', {
                  label: strings.StockSymbolFieldLabel
                }),
                PropertyPaneTextField('stockDisplayName',{
                  label:"Title"
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  // method to refresh any error after properties configuration
  protected onAfterPropertyPaneChangesApplied(): void {
    this.context.statusRenderer.clearError(this.domElement);
  }
  private needsConfiguration(): boolean {
    // as long as we don't have the stock symbol, we need configuration
    return !this.properties.demo && (!this.properties.stockSymbol ||
      this.properties.stockSymbol.length === 0);
  }
}
