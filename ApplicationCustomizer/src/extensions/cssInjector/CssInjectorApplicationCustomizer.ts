import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'CssInjectorApplicationCustomizerStrings';

import { SPComponentLoader } from '@microsoft/sp-loader';
const LOG_SOURCE: string = 'CssInjectorApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ICssInjectorApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class CssInjectorApplicationCustomizer
  extends BaseApplicationCustomizer<ICssInjectorApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {

    //require("./worldclock.css");
    SPComponentLoader.loadCss(this.context.pageContext.site.absoluteUrl + "/SiteAssets/hideNewsImage.css");
    //SPComponentLoader.loadCss("https://stridelyo365.sharepoint.com/sites/ProjectManagement/SiteAssets/CSS/worldclock.css");
    //SPComponentLoader.loadCss("https://invisible0365.sharepoint.com/sites/standex/SiteAssets/CSS/worldclock.css");
 }


}
