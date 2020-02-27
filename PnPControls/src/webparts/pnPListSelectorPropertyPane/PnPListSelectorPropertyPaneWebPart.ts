import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from "@pnp/spfx-property-controls/lib/PropertyFieldListPicker";
import styles from './PnPListSelectorPropertyPaneWebPart.module.scss';
import * as strings from 'PnPListSelectorPropertyPaneWebPartStrings';

export interface IPnPListSelectorPropertyPaneWebPartProps {
  description: string;
  lists:string|string[]; // Stores list IDs
}

export default class PnPListSelectorPropertyPaneWebPart extends BaseClientSideWebPart<IPnPListSelectorPropertyPaneWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.pnPListSelectorPropertyPane }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <span class="${ styles.title }">Welcome to SharePoint!</span>
              <p class="${ styles.subTitle }">Customize SharePoint experiences using Web Parts.</p>
              <p class="${ styles.description }">${escape(this.properties.description)}</p>
              <a href="https://aka.ms/spfx" class="${ styles.button }">
                <span class="${ styles.label }">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;
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
                PropertyFieldListPicker('lists',{
                  label:strings.listlable,
                  selectedList:this.properties.lists,
                  includeHidden:false,
                  orderBy:PropertyFieldListPickerOrderBy.Title,
                  disabled:false,
                  onPropertyChange:this.onPropertyPaneFieldChanged.bind(this),
                  properties:this.properties,
                  context:this.context,
                  onGetErrorMessage:null,
                  deferredValidationTime:0,
                  key:'listPickerFieldId'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
