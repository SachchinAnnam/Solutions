import { Dropdown,IDropdownOption,IDropdown } from "office-ui-fabric-react/lib/Dropdown";
export interface ISingleAppPartPageStates{
  TicketPriority:IDropdownOption[];
  preferredContactMethod:IDropdownOption[];
  ticketTypes:IDropdownOption[];
  IssueStatus:IDropdownOption[];
  Title:string;
}
