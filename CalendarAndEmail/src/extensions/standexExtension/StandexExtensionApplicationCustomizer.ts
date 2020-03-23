import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,PlaceholderContent, PlaceholderName, PlaceholderProvider
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import { SPComponentLoader } from '@microsoft/sp-loader';

// import styles from './StandexExtensionApplicationCustomizer.module.scss';

import * as strings from 'StandexExtensionApplicationCustomizerStrings';

import { escape } from '@microsoft/sp-lodash-subset';

const LOG_SOURCE: string = 'StandexExtensionApplicationCustomizer';
/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IStandexExtensionApplicationCustomizerProperties {
  // This is an example; replace with your own property
  //testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class StandexExtensionApplicationCustomizer
  extends BaseApplicationCustomizer<IStandexExtensionApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`); 

    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {

     

     //require("./worldclock.css");
     SPComponentLoader.loadCss("https://standex.sharepoint.com/sites/Electronics_Marketing/SiteAssets/CSS/worldclock.css");
     //SPComponentLoader.loadCss("https://stridelyo365.sharepoint.com/sites/ProjectManagement/SiteAssets/CSS/worldclock.css");
     //SPComponentLoader.loadCss("https://invisible0365.sharepoint.com/sites/standex/SiteAssets/CSS/worldclock.css");
  }
}
