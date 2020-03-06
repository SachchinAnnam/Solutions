import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'GetMySitesWebPartStrings';
import GetMySites from './components/GetMySites';
import { IGetMySitesProps } from './components/IGetMySitesProps';
export interface IGetMySitesWebPartProps {
  description: string;
  title: string;
}

export default class GetMySitesWebPart extends BaseClientSideWebPart<IGetMySitesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IGetMySitesProps > = React.createElement(
      GetMySites,
      {
        description: this.properties.description,
        siteurl: this.context.pageContext.web.absoluteUrl,
        spHttpClient:this.context.spHttpClient,
        title: this.properties.title,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
