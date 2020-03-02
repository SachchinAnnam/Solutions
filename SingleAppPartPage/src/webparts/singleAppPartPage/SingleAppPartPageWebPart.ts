import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { sp } from "@pnp/sp";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import { IField } from "@pnp/sp/fields/types";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import "@pnp/sp/fields";
import { Ichoices } from "../models/Ichocies";
import * as strings from 'SingleAppPartPageWebPartStrings';
import SingleAppPartPage from './components/SingleAppPartPage';
import { ISingleAppPartPageProps } from './components/ISingleAppPartPageProps';
import { IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';

export interface ISingleAppPartPageWebPartProps {
  description: string;
}

export default class SingleAppPartPageWebPart extends BaseClientSideWebPart<ISingleAppPartPageWebPartProps> {
  private _OnChoices : IDropdownOption[] = [];
  private _IssueStatus :IDropdownOption[] = [];
  protected onInit():Promise<void>{
    return new Promise<void>((resolve:()=>void,reject:(error?:any)=>void):void=>{
      sp.setup({
        sp:{
          headers: {
            "Accept": "application/json; odata=nometadata"
          }
        }
      });
      resolve();
    });
  }

  private getTicketPriority() {
    let TicketSystem = sp.web.lists.getByTitle("IT Ticket system");
    if(TicketSystem != null){
      let TicketPriority = TicketSystem.fields.getByInternalNameOrTitle("Priority");
      TicketPriority.select('Choices').get().then((choices:any)=>{
        debugger;
        let numCallbackRuns = 1;
        choices.Choices.forEach((_choice: any) => {
          this._OnChoices.push({
            key:numCallbackRuns,
            text:_choice
          });
          numCallbackRuns++;
        });
      });
    }
  }
  private getTicketIssueStatus(): IDropdownOption[]{
    let TicketSystem = sp.web.lists.getByTitle("IT Ticket system");
    if(TicketSystem != null){
      let TicketissueStatus = TicketSystem.fields.getByInternalNameOrTitle("IssueStatus1");
      TicketissueStatus.select('Choices').get().then((choices:any)=>{
        debugger;
        let numCallbackRuns = 1;
        choices.Choices.forEach((_choice: any) => {
          this._IssueStatus.push({
            key:numCallbackRuns,
            text:_choice
          });
          numCallbackRuns++;
        });
      });
    }
    return this._IssueStatus;
  }
  private getPreferredContactMethod():IDropdownOption[]{
    let TicketSystem = sp.web.lists.getByTitle("IT Ticket system");
    let _preferredContactMethod:IDropdownOption[] = [];
    let preferredContactMethod = TicketSystem.fields.getByInternalNameOrTitle("ContactMethod");
    preferredContactMethod.select('Choices').get().then((choices:any)=>{
      debugger;
      let numCallbackRuns = 1;
      choices.Choices.forEach((_choice: any) => {
          _preferredContactMethod.push({
          key:numCallbackRuns,
          text:_choice
        });
        numCallbackRuns++;
      });
    });
    return _preferredContactMethod;
  }

  private getTicketType():IDropdownOption[]{
    let TicketSystem = sp.web.lists.getByTitle("IT Ticket system");
    let _ticketType:IDropdownOption[] = [];
    let ticketType = TicketSystem.fields.getByInternalNameOrTitle("TicketType");
    ticketType.select('Choices').get().then((choices:any)=>{
      debugger;
      let numCallbackRuns = 1;
      choices.Choices.forEach((_choice: any) => {
        _ticketType.push({
          key:numCallbackRuns,
          text:_choice
        });
        numCallbackRuns++;
      });
    });
    return _ticketType;
  }
  public render(): void {
    this.getTicketPriority();
    const element: React.ReactElement<ISingleAppPartPageProps > = React.createElement(
      SingleAppPartPage,
      {
        description: this.properties.description,
        context:this.context,
        TicketPriority:this._OnChoices,
        IssueStatus:this.getTicketIssueStatus(),
        preferredContactMethod:this.getPreferredContactMethod(),
        TicketTypes:this.getTicketType()
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
