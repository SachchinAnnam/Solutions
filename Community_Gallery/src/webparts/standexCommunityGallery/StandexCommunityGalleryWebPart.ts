import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'StandexCommunityGalleryWebPartStrings';
import StandexCommunityGallery from './components/StandexCommunityGallery';
import { IStandexCommunityGalleryProps } from './components/IStandexCommunityGalleryProps';

export interface IStandexCommunityGalleryWebPartProps {
  description: string;
  libName: string;
}

export default class StandexCommunityGalleryWebPart extends BaseClientSideWebPart <IStandexCommunityGalleryWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IStandexCommunityGalleryProps> = React.createElement(
      StandexCommunityGallery,
      {
        description: this.properties.description,
        libName: this.properties.libName,
        spHttpClient: this.context.spHttpClient,
        siteUrl: this.context.pageContext.web.absoluteUrl
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
                PropertyPaneTextField('libName', {
                  label: "Library",
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
