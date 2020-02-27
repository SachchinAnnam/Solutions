import { IDropdown, IDropdownOption } from "office-ui-fabric-react/lib/components/Dropdown";
export interface IListDropDownState{
loading:boolean;
options:IDropdownOption[];
error:string;
}
