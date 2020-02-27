import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
// use for Color Picker
import {
  PropertyFieldColorPicker,
  PropertyFieldColorPickerStyle,
} from "@pnp/spfx-property-controls";

// Use for Date and Time Picker
import { PropertyFieldDateTimePicker,
  DateConvention,
  TimeConvention,
  IDateTimeFieldValue
} from "@pnp/spfx-property-controls/lib/PropertyFieldDateTimePicker";

// Use for List Picker
import {
PropertyFieldListPicker,PropertyFieldListPickerOrderBy
} from "@pnp/spfx-property-controls/lib/PropertyFieldListPicker";

// Use for Number control
import {
PropertyFieldNumber
} from "@pnp/spfx-property-controls/lib/PropertyFieldNumber";

// Use for Spin button control
import {
PropertyFieldSpinButton
} from "@pnp/spfx-property-controls/lib/PropertyFieldSpinButton";

// Use Property pane Editor Control
import {
PropertyPanePropertyEditor
} from "@pnp/spfx-property-controls/lib/PropertyPanePropertyEditor";

// Use for PropertyPaneWebPartInformation
import {
  PropertyPaneWebPartInformation
} from "@pnp/spfx-property-controls/lib/PropertyPaneWebPartInformation";

// Use for PropertyFieldSwatchColorPicker Control
import {
PropertyFieldSwatchColorPicker,PropertyFieldSwatchColorPickerStyle
} from "@pnp/spfx-property-controls/lib/PropertyFieldSwatchColorPicker";

// Use for PropertyFieldTermPicker Control
import {
PropertyFieldTermPicker,IPickerTerms, IPickerTerm
} from "@pnp/spfx-property-controls/lib/PropertyFieldTermPicker";

import { CalloutTriggers } from '@pnp/spfx-property-controls/lib/Callout';
import { PropertyFieldButtonWithCallout } from '@pnp/spfx-property-controls/lib/PropertyFieldButtonWithCallout';

import styles from './PnPControlsWebPart.module.scss';
import * as strings from 'PnPControlsWebPartStrings';

export interface IPnPControlsWebPartProps {
  description: string;
  Color: string; // use for Color Picker Control
  datetime: IDateTimeFieldValue; // Use for Date and time picker
  list:string | string[]; // Stores the list ID(s) // Use for List Picker Control
  numberValue:number;
  evenNumberValue:number;
  spinValue: number;
  toggleInfoHeaderValue: boolean;
  SwatchColor:string;
  terms:IPickerTerms;
}

export default class PnPControlsWebPart extends BaseClientSideWebPart<IPnPControlsWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.pnPControls }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <div style="background-color:${this.properties.Color}">Selected Color applied on this div</div>
              <div style="background-color:${this.properties.SwatchColor}">Selected swatch color applied on this div</div>
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
            description: "Page - 1 Sample"
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyFieldColorPicker('Color',{
                  label:'Color',
                  selectedColor:this.properties.Color,
                  onPropertyChange:this.onPropertyPaneFieldChanged,
                  properties:this.properties,
                  disabled:false,
                  isHidden:false,
                  alphaSliderHidden:false,
                  style:PropertyFieldColorPickerStyle.Full,
                  iconName:'Precipitation',
                  key:'ColorFieldId'
                }),
                PropertyFieldDateTimePicker('datetime',{
                  label:'Date & Time Picker',
                  initialDate:this.properties.datetime,
                  dateConvention:DateConvention.Date,
                  timeConvention:TimeConvention.Hours12,
                  onPropertyChange:this.onPropertyPaneFieldChanged,
                  properties:this.properties,
                  disabled:false,
                  onGetErrorMessage:null,
                  deferredValidationTime:0,
                  showLabels:true,
                  key:'DateTimeFieldId',
                })
              ]
            }
          ]
        },
        {
          header:{
            description : "Page - 2 Sample"
          },
          groups:[{
            groupName : "Group 1 - Page 2",
            groupFields:[
              PropertyFieldListPicker('lists',{
                label:"Select a list",
                selectedList:this.properties.list,
                context:this.context,
                onPropertyChange:this.onPropertyPaneFieldChanged.bind(this),
                disabled:false,
                includeHidden:false,
                orderBy:PropertyFieldListPickerOrderBy.Title,
                properties:this.properties,
                onGetErrorMessage:null,
                deferredValidationTime:0,
                key:'ListPickerFieldID'
              })
            ]
          },{
            groupName:"Group 2 - Page 2",
            groupFields:[
              PropertyFieldListPicker('multiLists',{
                label:"Select a multiple list",
                selectedList:this.properties.list,
                context:this.context,
                onPropertyChange:this.onPropertyPaneFieldChanged.bind(this),
                disabled:false,
                includeHidden:false,
                orderBy:PropertyFieldListPickerOrderBy.Title,
                properties:this.properties,
                onGetErrorMessage:null,
                deferredValidationTime:0,
                key:'ListPickerFieldID',
                multiSelect:true
              })
            ]
          },{
            groupName:"Group 3 -  Page 2",
            groupFields:[
              PropertyFieldNumber('numberValue',{
                key:"numberValue",
                maxValue:100,
                minValue:1,
                disabled:false,
                label:"Select Number",
                value:this.properties.numberValue,
                description:"Number Description"
               }),
               PropertyFieldNumber('evenNumberValue',{
                 key:"evenNumberValue",
                 maxValue:100,
                 minValue:1,
                 disabled:false,
                 label:"Select Even Number",
                 value:this.properties.evenNumberValue,
                 description:"Select even number only",
                 onGetErrorMessage:(value:number)=>{
                   if(value % 2){
                     return "Only even numbers are allowed!!";
                   }
                   else{
                     return '';
                   }
                 }
               })
            ]
          }]
        },
        {
          header:{
            description:"Page - 3 Sample"
          },
          groups:[
            {
              groupName:"Group 1 - Page 3",
              groupFields:[
                PropertyFieldSpinButton('spinValue', {
                  label: 'Spin Value',
                  initialValue: this.properties.spinValue,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  suffix: 'px',
                  min: 0,
                  max: 50,
                  step: 0.25,
                  decimalPlaces: 2,
                  incrementIconName: 'CalculatorAddition',
                  decrementIconName: 'CalculatorSubtract',
                  key: 'spinButtonFieldId'
                }),
                PropertyPanePropertyEditor({
                  webpart: this,
                  key: 'propertyEditor'
                }),
                PropertyPaneWebPartInformation({
                  description: `This is a <strong>demo webpart</strong>, used to demonstrate all the <a href="https://aka.ms/sppnp">PnP</a> property controls`,
                  moreInfoLink: `https://sharepoint.github.io/sp-dev-fx-property-controls/`,
                  videoProperties: {
                    embedLink: `https://www.youtube.com/embed/d_9o3tQ90zo`,
                    properties: { allowFullScreen: true}
                  },
                  key: 'webPartInfoId'
                }),
                PropertyFieldSwatchColorPicker('SwatchColor',{
                  label:"Swatch Color",
                  selectedColor:this.properties.SwatchColor,
                  colors:[
                    { color: '#ffb900', label: 'Yellow' },
                    { color: '#fff100', label: 'Light Yellow' },
                    { color: '#d83b01', label: 'Orange'},
                    { color: '#e81123', label: 'Red' },
                    { color: '#a80000', label: 'Dark Red'},
                    { color: '#5c005c', label: 'Dark Magenta' },
                    { color: '#e3008c', label: 'Light Magenta'},
                    { color: '#5c2d91', label: 'Purple'},
                    { color: '#eaeaea'},
                    { color: 'black', label: 'Black'},
                    { color: '#333333', label: 'Neutral'},
                    { color: 'rgba(102, 102, 102, 0.5)', label: 'Half Gray' }
                  ],
                  onPropertyChange:this.onPropertyPaneFieldChanged,
                  properties:this.properties,
                  key:"colorFieldID"
                })
              ]
            }
          ]
        },
        {
          header:{
            description:"Page - 4 Sample"
          },
          groups:[
            {
              groupName:"Group 1 - Page 4",
              groupFields:[
                PropertyFieldTermPicker('terms',{
                  label: 'Select terms',
                  panelTitle: 'Select terms',
                  initialValues: this.properties.terms,
                  allowMultipleSelections: true,
                  excludeSystemGroup: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  limitByGroupNameOrID: 'People',
                  limitByTermsetNameOrID: 'Location',
                  key: 'termSetsPickerFieldId'
                 })
              ]
            }
          ]
        }
      ]
    };
  }
}
