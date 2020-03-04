import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

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
}



export default class StockInfoWebPart extends BaseClientSideWebPart<IStockInfoWebPartProps> {
  public async render(): Promise<void> {

    //const apiKey:string = ""//await this.getApiKey();

    const apiKey:string = "E2IJ2Z352MX8G0E4";
    const element: React.ReactElement<IStockInfoProps > = React.createElement(
      StockInfo,
      {
        description: this.properties.description,
        demo: this.properties.demo,
        stockSymbol: this.properties.stockSymbol,
        autoRefresh: this.properties.autoRefresh,
        apiKey: apiKey,
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
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneToggle('demo', {
                  label: strings.DemoFieldLabel
                }),
                PropertyPaneTextField('stockSymbol', {
                  label: strings.StockSymbolFieldLabel
                }),
                PropertyPaneCheckbox('autoRefresh', {
                  text: strings.AutoRefreshFieldLabel
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

  // private async getApiKey(): Promise<string> {

  //   const apiKeyName: string = "PnP-Portal-AlphaVantage-API-Key";

  //   // try to get the API Key from the local session storage
  //   let apiKey: string = sessionStorage.getItem(apiKeyName);

  //   // if it is not there, load it from the tenant properties
  //   // and store its value in the session storage
  //   if (!apiKey) {
  //     const { sp} = await import("@pnp/sp");

  //     const storageEntity: StorageEntity = await sp.web.getStorageEntity(apiKeyName);
  //     if (storageEntity && !storageEntity['odata.null']) {
  //       apiKey = storageEntity.Value;
  //       console.log(apiKey);
  //       sessionStorage.setItem(apiKeyName, apiKey);
  //     }
  //   }

  //   // return the API Key value
  //   return (apiKey);
  // }

}
