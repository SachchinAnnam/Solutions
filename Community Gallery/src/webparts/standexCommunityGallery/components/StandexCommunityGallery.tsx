import * as React from 'react';
import styles from './StandexCommunityGallery.module.scss';
import { IStandexCommunityGalleryProps } from './IStandexCommunityGalleryProps';
import { IStandexCommunityGallerystate } from './IStandexCommunityGallerystate';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
export default class StandexCommunityGallery extends React.Component<IStandexCommunityGalleryProps, IStandexCommunityGallerystate> {

  constructor(props: IStandexCommunityGalleryProps, state: IStandexCommunityGallerystate) {
    super(props);
    this.state = {
      status: 'ready',
      Title: '',
      items: []
    };
  }
  public componentDidMount(): void {
    this.getItems();
  }

  /* Get all Folders from LibraryName */
  private getItems(): void {
    this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/lists/getbytitle('${this.props.libName}')/items?$filter=ContentType eq 'Folder'&$orderby=Created desc`,
      SPHttpClient.configurations.v1,
      {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      })
      .then((response: SPHttpClientResponse): Promise<{ value: any }> => {
        return response.json();
      }
      )
      .then((response: { value: any }): void => {
        if (response.value.length !== 0) {
          debugger;
          this.setState({
            items: response.value
          });
        }
        else {
          this.setState({
            items: []
          });
        }
      });
  }
    /* Get Item Count in each folders */
  //   private  getItemCounts():string{
  //   this.props.spHttpClient.get(`${this.props.siteUrl}/_api/web/GetFolderByServerRelativeUrl('${this.props.libName}/No%20Mans%20Land')/itemcount`,
  //     SPHttpClient.configurations.v1,
  //     {
  //       headers: {
  //         'Accept': 'application/json;odata=nometadata',
  //         'odata-version': ''
  //       }
  //     })
  //     .then((response: SPHttpClientResponse): Promise<{ value: any }> => {
  //       return response.json();
  //     }
  //     )
  //     .then((response: { value: any }): void => {
  //       console.log(response);

  //     });
  //   let itemCount: string = "";
  //   return itemCount;

  // }

  public render(): React.ReactElement<IStandexCommunityGalleryProps> {

    let url = this.props.siteUrl;

    return (
      <div className={styles.standexCommunityGallery}>
        {this.state.items.map(function (item, key) {
          return <div className={styles.responsive} key={key}>
            <div className={styles.gallery}>
              <a target="_blank" href={url + "/Albums/" + item.Title}>
                <img src="https://strickly.sharepoint.com/sites/Home/SiteAssets/gallery1.png" width="600" height="400"></img>
              </a>
              <div className={styles.desc}>{item.Title}</div>
              <div className={styles.photosno}>18 Photos</div>
            </div>
          </div>;
        }
        )}
        <div className={styles.clearfix}></div>
      </div>
    );
  }
}
