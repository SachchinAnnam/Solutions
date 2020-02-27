import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import { update, get } from '@microsoft/sp-lodash-subset';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-webpart-base';

// Dropdown custom control
import { PropertyPaneDropDown } from './components/PropertyPaneDropDown';
import * as strings from 'CustomPropertyPaneDemoWebPartStrings';
import CustomPropertyPaneDemo from './components/CustomPropertyPaneDemo';

import { ICustomPropertyPaneDemoProps } from './components/ICustomPropertyPaneDemoProps';

export interface ICustomPropertyPaneDemoWebPartProps {
  listName: string;
}



export default class CustomPropertyPaneDemoWebPart extends BaseClientSideWebPart<ICustomPropertyPaneDemoWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICustomPropertyPaneDemoProps > = React.createElement(
      CustomPropertyPaneDemo,
      {
        listName: this.properties.listName
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

  private loadLists():Promise<IDropdownOption[]>{
    return new Promise<IDropdownOption[]>((
      resolve:(options:IDropdownOption[])=>void,
      reject:(error:any)=>void)=>{
      setTimeout(()=>{
        resolve([{
          key:"sharedDocuments",
          text:"Shared Documents"
        },{
          key:"myDocuments",
          text:"My Documents"
        }]);
      },2000);
    });
  }

  private onListChange(propertyPath:string,newValue:any):void{
    const oldValue:any = get(this.properties,propertyPath);
    update(this.properties,propertyPath,():any=>{
      return newValue;
    });

    this.render();
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
                new PropertyPaneDropDown('listName', {
                  label: strings.ListFieldLabel,
                  loadOptions: this.loadLists.bind(this),
                  onPropertyChange: this.onListChange.bind(this),
                  selectedKey: this.properties.listName
                })
             ]
            }
          ]
        }
      ]
    };
  }
}
