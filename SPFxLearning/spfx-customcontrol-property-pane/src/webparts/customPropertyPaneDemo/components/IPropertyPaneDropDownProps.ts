import { Dropdown,IDropdownOption } from "office-ui-fabric-react/lib/components/Dropdown";

export interface IPropertyPaneDropDownProps{
  label :string;
  loadOptions:()=>Promise<IDropdownOption[]>;
  onPropertyChange:(PropertyPath:string,NewValue:any)=>void;
  selectedKey:string|number;
  disabled?:boolean;
}


