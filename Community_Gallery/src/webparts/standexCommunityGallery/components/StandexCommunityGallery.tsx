import * as React from 'react';
import styles from './StandexCommunityGallery.module.scss';
import { IStandexCommunityGalleryProps } from './IStandexCommunityGalleryProps';
import { IStandexCommunityGallerystate } from './IStandexCommunityGallerystate';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { ILibItem } from './ILibItem';
export default class StandexCommunityGallery extends React.Component<IStandexCommunityGalleryProps, IStandexCommunityGallerystate> {

  constructor(props: IStandexCommunityGalleryProps, _state: IStandexCommunityGallerystate) {
    super(props);
    this.state = {
      status: 'ready',
      Title: '',
      items: [],
    };
  }
  public componentDidMount(): void {
    this.getItems();
    //this.getItemCounts();
  }

  // $select=ID,Title,Folder/ItemCount&$expand=Folder/ItemCount&$filter=FSObjType eq 1
  // $select=*&$filter=ContentType eq 'Folder'&$orderby=Created desc
  /* Get all Folders from LibraryName */
  private getItems(): void {
    this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.libName}')/items?$select=ID,Title,FileRef,Folder/ItemCount&$expand=Folder/ItemCount&$filter=FSObjType eq 1`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      })
      .then((response: SPHttpClientResponse): Promise<any> => {
        return response.json();
      }
      )
      .then((response: any): void => {
        if(response.value.length){
          let items:ILibItem[] = [];
          response.value.forEach(_element => {
            let title:string = _element.FileRef.replace("/sites/Electronics_Community/EventImages/","")
            items.push({
              Id:_element.ID,
              ItemCount:_element.Folder.ItemCount,
              Title:title
            })
          });
         this.setState({
            items:items
          })
        }

      
      });
  }
  public render(): React.ReactElement<IStandexCommunityGalleryProps> {

    let url = this.props.siteUrl;

    return (
      <div className={styles.standexCommunityGallery}>
        {this.state.items.map(function (item, key) {
          return <div className={styles.responsive} key={key}>
            <div className={styles.gallery}>
              <a target="_blank" href={url + "/Albums/" + item.Title}>
                <img src="../../SiteAssets/gallery1.png" width="600" height="400"></img>
              </a>
              <div className={styles.desc}>{item.Title}</div>
        <div className={styles.photosno}>{item.ItemCount}</div>
            </div>
          </div>;
        }
        )}
        <div className={styles.clearfix}></div>
      </div>
    );
  }
}
