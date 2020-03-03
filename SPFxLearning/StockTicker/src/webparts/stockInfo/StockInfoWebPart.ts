import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './StockInfoWebPart.module.scss';
import * as strings from 'StockInfoWebPartStrings';
import { IStockInfoWebpartProps } from './IStockInfoWebpartProps';
import { PropertyFieldDimensionPicker } from 'sp-client-custom-fields/lib/PropertyFieldDimensionPicker';


// export interface IStockInfoWebPartProps {
//   description: string;
// }

export default class StockInfoWebPart extends BaseClientSideWebPart<IStockInfoWebpartProps> {

  public constructor(context?: IWebPartContext) {
    super();

    //Hack: to invoke correctly the onPropertyChange function outside this class
    //we need to bind this object on it first
    this.onPropertyPaneFieldChanged = this.onPropertyPaneFieldChanged.bind(this);
  }

  public render(): void {

    if (this.properties.stock == null || this.properties.stock == '') {
      var error = `
        <div class="ms-MessageBar">
          <div class="ms-MessageBar-content">
            <div class="ms-MessageBar-icon">
              <i class="ms-Icon ms-Icon--Info"></i>
            </div>
            <div class="ms-MessageBar-text">
              ${strings.ErrorSelectStock}
            </div>
          </div>
        </div>
      `;
      this.domElement.innerHTML = error;
      return;
    }
    var width: number = Number(this.properties.dimension.width.replace("px", "").replace("%", ""));
    var height: number = Number(this.properties.dimension.height.replace("px", "").replace("%", ""));

    //var html = '<img src="//chart.finance.yahoo.com/t?s=' + this.properties.stock + '&amp;lang=' + this.properties.lang + '&amp;region=' + this.properties.region + '&amp;width=' + width + '&amp;height=' + height + '" alt="" width="' + width + '" height="' + height + '">';
      var html = '<img src="//finance.yahoo.com/chart/MSFT" alt="" width="' + width + '" height="' + height + '">';
    this.domElement.innerHTML = html;
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
                PropertyPaneTextField('Stock', {
                  label: strings.Stock
                }),
                PropertyFieldDimensionPicker('dimension', {
                  label: strings.Dimension,
                  initialValue: this.properties.dimension,
                  preserveRatio: true,
                  preserveRatioEnabled: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  render: this.render.bind(this),
                  disableReactivePropertyChanges: this.disableReactivePropertyChanges,
                  properties: this.properties,
                  disabled: false,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'stockInfoDimensionFieldId'
                }),
                PropertyPaneTextField('lang', {
                  label: strings.Lang
                }),
                PropertyPaneTextField('region', {
                  label: strings.Region
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
