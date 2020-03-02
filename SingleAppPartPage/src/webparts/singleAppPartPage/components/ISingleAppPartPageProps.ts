
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Ichoices } from "../../models/Ichocies";
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
export interface ISingleAppPartPageProps {
  description: string;
  context : WebPartContext;
  TicketPriority?:IDropdownOption[];
  IssueStatus?:IDropdownOption[];
  preferredContactMethod?:IDropdownOption[];
  TicketTypes?:IDropdownOption[];
}
