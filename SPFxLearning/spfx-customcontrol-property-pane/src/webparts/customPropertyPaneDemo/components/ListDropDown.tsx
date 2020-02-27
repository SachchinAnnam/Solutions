import * as React from "react";
import { Dropdown,IDropdownOption } from "office-ui-fabric-react/lib/components/Dropdown";
import { Spinner } from "office-ui-fabric-react/lib/components/Spinner";
import { IListDropDownProps } from "./IListDropDownProps";
import { IListDropDownState } from "./IListDropDownState";
import { unstable_renderSubtreeIntoContainer } from "react-dom";


export default class ListDropDown extends React.Component<IListDropDownProps,IListDropDownState>{
private selectedKey : React.ReactText;
constructor(props:IListDropDownProps,state:IListDropDownState){
  super(props);
  this.selectedKey = props.selectedKey;
  this.state = {
  loading : false,
  options : undefined,
  error:undefined
  };
}

public componentDidMount():void{
  this.loadOptions();
}

public componentDidUpdate(prevProps:IListDropDownProps,prevState:IListDropDownState):void{
  if(this.props.disabled !== prevProps.disabled || this.props.selectedKey !== prevProps.StateKey){
    this.loadOptions();
  }
}

private loadOptions():void {
  this.setState({
    loading:true,
    error:undefined,
    options:undefined
  });

  this.props.loadOptions().then((options:IDropdownOption[]):void=>{
    this.setState({
      loading:false,
      error:undefined,
      options:options
    });
  },(error:any):void=>{

    this.setState((prevState:IListDropDownState,props:IListDropDownProps):IListDropDownState=>{

      prevState.loading=false;
      prevState.error=error;

      return prevState;
    });
  });
}

 public render():JSX.Element{
  const loading:JSX.Element = this.state.loading?<div><Spinner label={'Loading options....'}/></div>:<div/>;

  const error:JSX.Element = this.state.error !== undefined ? <div className={'ms-TextField-errorMessage ms-u-slideDownIn20'}>
    error while loading items:{this.state.error}
    </div>:<div/>;

    return(
      <div>
        <Dropdown label={this.props.label}
        disabled={this.props.disabled || this.state.loading ||
          this.state.error !== undefined}
        onChanged = {this.onChanged.bind(this)}
        selectedKey = {this.selectedKey}
        options = {this.state.options}>/</Dropdown>
        {loading}
        {error}
      </div>
    );
 }

 private onChanged(option:IDropdownOption,index?:number):void{
    this.selectedKey = option.key;
    const options : IDropdownOption[] = this.state.options;
    options.forEach((o:IDropdownOption):void=>{
      if(o.key !== option.key){
        o.selected = false;
      }
    });

    this.setState((prevState:IListDropDownState,props:IListDropDownProps):IListDropDownState=>{
      prevState.options = options;
      return prevState;
    });

    if(this.props.onChanged){
      this.props.onChanged(option,index);
    }
 }

}
