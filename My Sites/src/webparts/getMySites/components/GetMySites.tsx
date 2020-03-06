import * as React from 'react';
import styles from './GetMySites.module.scss';
import { IGetMySitesProps } from './IGetMySitesProps';
import { IGetMySitesState } from "../components/IGetMySitesState";
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
import { SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions } from '@microsoft/sp-http';
import { escape } from '@microsoft/sp-lodash-subset';

export default class GetMySites extends React.Component<IGetMySitesProps, IGetMySitesState> {
  constructor(props: IGetMySitesProps, state: IGetMySitesState){
        
    super(props);      
    this.state = {    
      siteItems:[],
      IListItem:[]
    };    
  }

  public componentDidMount() {
    let siteItem:any[] = [];
    var reactHandler = this;
    var spRequest = new XMLHttpRequest();    
    spRequest.open('GET', `${this.props.siteurl}/_api/search/query?querytext='contentclass:STS_Site -Path:https://domain.sharepoint.com/sites* -Path:https://domain.sharepoint.com/portals/* -Path:https://domain-my.sharepoint.com'&rowlimit=100`,true);    
    spRequest.setRequestHeader("Accept","application/json");                        
    spRequest.onreadystatechange =function(){
        if (spRequest.readyState === 4 && spRequest.status === 200){    
            var result = JSON.parse(spRequest.responseText);
          for (let i = 0; i < result.PrimaryQueryResult.RelevantResults.Table.Rows.length; i++) {
            const element = result.PrimaryQueryResult.RelevantResults.Table.Rows[i];
            siteItem.push(element.Cells);
          }
          reactHandler.setState({ 
            siteItems: siteItem
         }); 
                
        }    
        else if (spRequest.readyState === 4 && spRequest.status !== 200){    
            console.log('Error Occured !');    
        }
    };    
    spRequest.send();
  }

  public render(): React.ReactElement<IGetMySitesProps> {
    return (
      <div>
      <WebPartTitle displayMode={this.props.displayMode}
      title={this.props.title}
      updateProperty={this.props.updateProperty} />
      <div id="mySites">
    <ul className={styles.removeulDots} >          
            {this.state.siteItems.map(function (Obj,Value){
                var mySitesList = '';
                var title = '';
                var url = '';
                Obj.forEach(val => {
                 
                  if (val) {
                    var keyval = val.Key;
                    if(keyval == "Title"){
                      title = val.Value;
                    }
                    else if (keyval == "Path") {
                      url = val.Value;
                    }                    
                  }
                });
                    return (<li className={styles.Iconli}><a className={styles.nav} href={url} target="_blank">{title}</a></li>);
                })
              }
              </ul>
     </div> 
     </div>
      
    );
  }
}