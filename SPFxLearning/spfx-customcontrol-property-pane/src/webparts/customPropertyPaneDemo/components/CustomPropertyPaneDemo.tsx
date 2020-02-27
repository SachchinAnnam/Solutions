import * as React from 'react';
import styles from './CustomPropertyPaneDemo.module.scss';
import { ICustomPropertyPaneDemoProps } from './ICustomPropertyPaneDemoProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class CustomPropertyPaneDemo extends React.Component<ICustomPropertyPaneDemoProps, {}> {
  public render(): React.ReactElement<ICustomPropertyPaneDemoProps> {
    return (
      <div className={ styles.customPropertyPaneDemo }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.listName)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
