import * as React from 'react';
import styles from './SingleAppPartPage.module.scss';
import { ISingleAppPartPageProps } from './ISingleAppPartPageProps';
import { ISingleAppPartPageStates } from "./ISingleAppPartPageStates";
import { escape } from '@microsoft/sp-lodash-subset';
import { TextField } from "office-ui-fabric-react/lib/TextField";
import { Stack,IStackProps} from 'office-ui-fabric-react/lib/Stack';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { PrimaryButton,DefaultButton } from "office-ui-fabric-react/lib/Button";
import { Ichoices } from "../../models/Ichocies";
import { Dropdown } from "office-ui-fabric-react/lib/Dropdown";
import { DateTimePicker, DateConvention, TimeConvention, TimeDisplayControlType  } from "@pnp/spfx-controls-react/lib/DateTimePicker";
export default class SingleAppPartPage extends React.Component<ISingleAppPartPageProps, ISingleAppPartPageStates> {


  constructor(props:ISingleAppPartPageProps,State:ISingleAppPartPageStates){
    super(props);
    this.state = {
      TicketPriority:this.props.TicketPriority,
      preferredContactMethod:this.props.preferredContactMethod,
      ticketTypes:this.props.TicketTypes,
      IssueStatus:this.props.IssueStatus
    };
  }

  public componentDidMount():void{
    console.log(this.props.TicketPriority);
    let options = [];
 }

  public render(): React.ReactElement<ISingleAppPartPageProps> {
  return(
      <Stack>
        <div>
          <p>Generate new tickets</p>
        </div>
         <TextField
          label="Title"
          styles={{ fieldGroup: { width: 300 } }}
          />
          <PeoplePicker
          context={this.props.context}
          titleText="Assigned To"
          personSelectionLimit={3}
          groupName={""}
          showtooltip={true}
          selectedItems={this._getPeoplePickerItems}
          isRequired={true}
          disabled={false}
          showHiddenInUI={false}
          principalTypes={[PrincipalType.User]}
          resolveDelay={1000}>
          </PeoplePicker>
          <Dropdown
            label="Ticket Priority"
            placeholder="Select an option"
            options={this.state.TicketPriority}
            styles={{ dropdown: { width: 300 } }}
          />
          <DateTimePicker label="Due Date"
            dateConvention={DateConvention.Date}
            timeConvention={TimeConvention.Hours12}
          />
          <Dropdown
            label="Ticket Priority"
            placeholder="Select an option"
            options={this.state.IssueStatus}
            styles={{ dropdown: { width: 300 } }}
          />
          <Dropdown
            label="Preferred Contact Method"
            placeholder="Select an option"
            options={this.state.preferredContactMethod}
            styles={{ dropdown: { width: 300 } }}
          />
          <Dropdown
            label="Ticket Type"
            placeholder="Select an option"
            options={this.state.ticketTypes}
            disabled={false}
            styles={{ dropdown: { width: 300 } }}
          />
          <PeoplePicker
          context={this.props.context}
          titleText="CC"
          personSelectionLimit={3}
          groupName={""}
          showtooltip={true}
          selectedItems={this._getPeoplePickerItems}
          isRequired={true}
          disabled={false}
          showHiddenInUI={false}
          principalTypes={[PrincipalType.User]}
          resolveDelay={1000}>
          </PeoplePicker>
          <TextField
          label="Description"
          styles={{ fieldGroup: { width: 300 } }}
          multiline={true}
          multiple
          rows={6}
          resizable={true}
          />
           <DefaultButton
           text="Save"
           onClick={this._alertClicked}
           allowDisabledFocus
           disabled={false}
           checked={false} />
        </Stack>
     );
 }

  private _getPeoplePickerItems(items: any[]) {
    console.log('Items:', items);
  }

  private  _alertClicked(): void {
    alert('Clicked');
  }

  private

}
