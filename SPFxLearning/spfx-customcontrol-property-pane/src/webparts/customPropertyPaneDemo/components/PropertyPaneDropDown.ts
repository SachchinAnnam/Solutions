import * as React from "react";
import * as ReactDom from "react-dom";

import {
  IPropertyPaneField,
  PropertyPaneFieldType
} from '@microsoft/sp-webpart-base';
import { IDropdownOption } from "office-ui-fabric-react/lib/components/Dropdown";
import { IPropertyPaneDropDownProps } from "./IPropertyPaneDropDownProps";
import { IPropertyPaneDropDownInternalProps } from "./IPropertyPaneDropDownInternalProps";
import ListDropDown from "./ListDropDown";
import { IListDropDownProps } from "./IListDropDownProps";

export class PropertyPaneDropDown implements IPropertyPaneField<IPropertyPaneDropDownProps> {
  public type: PropertyPaneFieldType =  PropertyPaneFieldType.Custom;
  public targetProperty : string;
  public properties: IPropertyPaneDropDownInternalProps;
  private elem : HTMLElement;

  constructor(targetProperty:string,properties:IPropertyPaneDropDownProps){
    this.targetProperty = targetProperty;
    this.properties = {
      key:properties.label,
      label:properties.label,
      loadOptions:properties.loadOptions,
      onPropertyChange:properties.onPropertyChange,
      selectedKey:properties.selectedKey,
      disabled:properties.disabled,
      onRender:this.onRender.bind(this)
    };
  }

  public render():void{
    if(!this.elem){
      return;
    }
    this.onRender(this.elem);
  }

  private onRender(elem:HTMLElement):void{
    if(!this.elem){
      this.elem = elem;
    }

    const element:React.ReactElement<IListDropDownProps>=React.createElement(ListDropDown,{
      label: this.properties.label, 
      loadOptions: this.properties.loadOptions, 
      onChanged: this.onChanged.bind(this), 
      selectedKey: this.properties.selectedKey, 
      disabled: this.properties.disabled,
      StateKey: new Date().toString()
     });

     ReactDom.render(element,elem);
  }

  private onChanged(option:IDropdownOption,index?:number):void{
    this.properties.onPropertyChange(this.targetProperty,option.key);
  }
}
