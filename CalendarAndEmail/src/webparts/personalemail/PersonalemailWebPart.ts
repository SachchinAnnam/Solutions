import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PersonalemailWebPartStrings';
import Personalemail from './components/Personalemail';
import { IPersonalemailProps } from './components/IPersonalemailProps';
import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/PropertyFieldHeader';
import { PropertyFieldToggleWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldToggleWithCallout';
//import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';
import { MSGraphClient } from '@microsoft/sp-http';

export interface IPersonalemailWebPartProps {
  title: string;
  nrOfMessages: number;
  showInboxOnly: boolean;
}

export default class PersonalemailWebPart extends BaseClientSideWebPart <IPersonalemailWebPartProps> {
  private graphClient: MSGraphClient;
  private propertyFieldNumber;

  public onInit(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: any) => void): void => {
      this.context.msGraphClientFactory
        .getClient()
        .then((client: MSGraphClient): void => {
          this.graphClient = client;
          resolve();
        }, err => reject(err));
    });
  }

  public render(): void {
    const element: React.ReactElement<IPersonalemailProps> = React.createElement(
      Personalemail,
      {
        title: this.properties.title,
        nrOfMessages: this.properties.nrOfMessages,
        showInboxOnly: this.properties.showInboxOnly,
        // pass the current display mode to determine if the title should be
        // editable or not
        displayMode: this.displayMode,
        // pass the reference to the MSGraphClient
        graphClient: this.graphClient,
        // handle updated web part title
         updateProperty: (value: string): void => {
           // store the new title in the title web part property
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

  //executes only before property pane is loaded.
  protected async loadPropertyPaneResources(): Promise<void> {
    // import additional controls/components
    const { PropertyFieldNumber } = await import(
      /* webpackChunkName: 'pnp-propcontrols-number' */
      '@pnp/spfx-property-controls/lib/propertyFields/number'
    );
     this.propertyFieldNumber = PropertyFieldNumber;
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
              groupFields: [
                this.propertyFieldNumber("nrOfMessages", {
                  key: "nrOfMessages",
                  label: strings.NrOfMessagesToShow,
                  value: this.properties.nrOfMessages,
                  minValue: 1,
                  maxValue: 10
                }),
                 PropertyFieldToggleWithCallout('showInboxOnly', {
                  calloutTrigger: CalloutTriggers.Click,
                  key: 'showInboxOnly',
                  label: strings.ShowInboxOnly,
                  calloutContent: React.createElement('p', {}, strings.ShowInboxOnlyCallout),
                  checked: this.properties.showInboxOnly
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
