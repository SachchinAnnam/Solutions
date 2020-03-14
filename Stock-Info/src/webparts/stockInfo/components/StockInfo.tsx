import * as React from 'react';
import styles from './StockInfo.module.scss';
import { IStockInfoProps } from './IStockInfoProps';
import { IStockInfoState } from "./IStockInfoState";
import { escape } from '@microsoft/sp-lodash-subset';
import { HttpClientConfiguration,SPHttpClient,SPHttpClientResponse } from "@microsoft/sp-http";
import * as strings from 'StockInfoWebPartStrings';

import { IStockInfoData, IStockData } from './IStockInfoData';
import { IAVResults, IAVResultsMetadata, IAVResultsSeries } from './AlphaVantageResults';


import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import {
  Spinner,
  SpinnerSize
} from 'office-ui-fabric-react/lib/Spinner';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { HttpClientResponse, HttpClient } from '@microsoft/sp-http';
import * as lodash from '@microsoft/sp-lodash-subset';

const FIVE_MINUTES = 10 * 60 * 1000;
export default class StockInfo extends React.Component<IStockInfoProps, IStockInfoState> {

  constructor(props:IStockInfoProps){
    super(props);
    this.state={
      title:this.props.title,
      loading: false,
      stockInfo: null
    };

 }

  public componentDidMount(): void {
    this.getExistingValuesFromSPList();
    // if (!this.props.needsConfiguration) {
    //   if(sessionStorage.getItem("lastAPITime")){
    //     if(new Date().getTime() - new Date(sessionStorage.getItem("lastAPITime")).getTime() > FIVE_MINUTES){
    //       this.loadStockInformation(this.props.stockSymbol, this.props.demo);
    //     }
    //     {
    //       this.setState({
    //         loading:false,
    //         stockInfo:JSON.parse(sessionStorage.stockInfo)
    //       });
    //       return;
    //     }
    //   }
    //   else
    //   {
    //     this.loadStockInformation(this.props.stockSymbol, this.props.demo);
    //   }
    // }
  }
 // on componentWillReceiveProps refresh data
  public componentWillReceiveProps(nextProps: IStockInfoProps): void {
    this.getExistingValuesFromSPList();
    // if (nextProps.stockSymbol || nextProps.demo) {
    //   this.loadStockInformation(nextProps.stockSymbol, nextProps.demo);
    // }
  }
  private loadDemoValues(stockSymbol:string):void{
    this.setState({
      loading: false,
      stockInfo: {
        symbol: 'Contoso Electronics',
        lastRefreshed: new Date(),
        lastData: {
          open: 110,
          high: 110,
          low: 110,
          close: 110,
          volume: 0
        },
        previousClose: 109.91
      }
    });
  }

  protected getItemEndPoint():string{
    let endPoint :string = `${this.props.siteURL}/_api/web/lists/getbytitle('StockInfo')/items?$select=*&$top=1`;
    return endPoint;
 }

  protected getExistingValuesFromSPList():void{
    try {
      this.props.httpClient.get(this.getItemEndPoint(), SPHttpClient.configurations.v1, {
        headers: {
          'Accept': 'application/json;odata=nometadata',
          'odata-version': ''
        }
      }).then((response:HttpClientResponse):Promise<{value:any}>=>{
        return response.json();
      }).then((response:{value:any}):void=>{
         sessionStorage.setItem("newStockValues",response.value[0].StockJson);
         this.loadStockInformation("AQUA",false,JSON.parse(response.value[0].StockJson));
      },(error:any):void=>{

      });

    } catch (error) {

    }
  }


  private loadStockInformation(stockSymbol: string, demo: boolean,dataNew:IAVResults): void {
    if (demo) {
       this.loadDemoValues(stockSymbol);
       return;
    }
    // double-check to have the API Key
    if (!this.props.apiKey) {

      // if we don't have the API Key, stop the Spinner
      this.setState({
        loading: false,
        stockInfo: null
      });
      // and show a specific error
      this.props.errorHandler(strings.NoAPIKeyInTenantProperties);
    } else {

      // show the Spinner control
      this.setState({
        loading: true
      });

      // get the current date and time
      const now: Date = new Date();

      // determine the date of the last work day
      const lastDay: Date = new Date(now.getTime() - (24 * ((now.getDay() === 0) ? 2 : (now.getDay() === 1) ? 3 : 1)) * 60 * 60000);
      const lastDayName: string = lastDay.toISOString().substring(0, 10);

      // get yesterday's closing price if it is not already in the local storage cache
      const dailyCloseKeyName: string = `PnP-Portal-AlphaVantage-Close-${escape(stockSymbol)}-${lastDayName}`;

      // try to get the close price from the local session storage
      let closeValue: number = Number(sessionStorage.getItem(dailyCloseKeyName));

      // if it is not there, load it from the API
      // and store its value in the session storage
      if (!closeValue) {

        if (!dataNew["Error Message"] && dataNew["Meta Data"] && dataNew["Time Series (Daily)"]) {

          // get yesterday date and time
          const yesterdayData: IAVResultsSeries = dataNew["Time Series (5min)"][dataNew["Meta Data"]["3. Last Refreshed"]];
          closeValue = yesterdayData["4. close"];

          if (closeValue > 0) {
            sessionStorage.setItem(dailyCloseKeyName, closeValue.toString());
          }
        }

        // const serviceDailyEndpoint: string =
        //   `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${escape(stockSymbol)}&apikey=${this.props.apiKey}`;

        //   console.log(serviceDailyEndpoint);
        // // request stock information to the REST API
        // this.props.httpClient
        // .get(serviceDailyEndpoint, HttpClient.configurations.v1)
        // .then((response: HttpClientResponse): Promise<IAVResults> => {
        //   return response.json();
        // })
        // .then((data: IAVResults): void => {

        //   // if there are no errors and we have data
        //   if (!data["Error Message"] && data["Meta Data"] && data["Time Series (Daily)"]) {

        //     // get yesterday date and time
        //     const yesterdayData: IAVResultsSeries = data["Time Series (Daily)"][lastDayName];
        //     closeValue = yesterdayData["4. close"];

        //     if (closeValue > 0) {
        //       sessionStorage.setItem(dailyCloseKeyName, closeValue.toString());
        //     }
        //   }
        // });
      }

      const serviceIntradayEndpoint: string =
       `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${escape(stockSymbol)}&interval=1min&apikey=${this.props.apiKey}`;

      // request stock information to the REST API
      this.props.httpClient
        .get(serviceIntradayEndpoint, HttpClient.configurations.v1)
        .then((response: HttpClientResponse): Promise<IAVResults> => {
          return response.json();
        })
        .then((data: IAVResults): void => {

          // if there are no errors and we have data
          if (!data["Error Message"] && data["Meta Data"] && data["Time Series (1min)"]) {

            const timeSeries: Array<IAVResultsSeries> = new Array<IAVResultsSeries>();

            // parse response to retrieve the quotes
            lodash.forIn(data["Time Series (1min)"], (value: IAVResultsSeries, key: string) => {
              timeSeries.push(value);
            });

            // get the last data series from the AV service
            const lastAVDataSeries: IAVResultsSeries = timeSeries[0];
            // get yesterday date and time
            // build the state variable to render the stock information
            const stockInfo: IStockInfoData = {
              symbol: data["Meta Data"]["2. Symbol"],
              lastRefreshed: now,
              lastData: {
                open: lastAVDataSeries["1. open"],
                high: lastAVDataSeries["2. high"],
                low: lastAVDataSeries["3. low"],
                close: lastAVDataSeries["4. close"],
                volume: lastAVDataSeries["5. volume"]
              },
              previousClose: closeValue
            };
            sessionStorage.setItem("lastAPITime", new Date().toISOString());
            sessionStorage.setItem("stockInfo",JSON.stringify(stockInfo));
            // set the state with the new stock information and stop the Spinner
            this.setState({
              loading: false,
              stockInfo: stockInfo
            });

          } else {
            // if we don't have data in the response, stop the Spinner and show previous data
            this.setState({
              loading: false
            });
            // and show a specific error
            this.props.errorHandler(`${strings.NoDataForStockSymbol}${escape(stockSymbol)}`);
          }
        }, (error: any): void => {
          // in case of any other generic error, stop the Spinner and show previous data
          this.setState({
            loading: false
          });
          // and show the error
          this.props.errorHandler(error);
        })
        .catch((error: any): void => {
          // in case of any other error, stop the Spinner and show previous data
          this.setState({
            loading: false
          });
          // and show the error
          this.props.errorHandler(error);
        });
     }
  }
  public render(): React.ReactElement<IStockInfoProps> {

    let contents: JSX.Element;
    // if we already have the configuration
    if (this.props.needsConfiguration === false &&
      this.state.stockInfo) {
      if (this.state.loading) {
        // show the Spinner control while loading data
        contents = <Spinner size={SpinnerSize.large} label={strings.LoadingDataLabel} />;
      } else {
        // show the Stock information, if we already have it
        const lastStockData: IStockData = this.state.stockInfo != null ? this.state.stockInfo.lastData : null;
        const previousClose: number = this.state.stockInfo != null ? this.state.stockInfo.previousClose : 0;
        const difference: number = lastStockData.close - previousClose;
        const differencePercent: number = (difference / previousClose) * 100;
        contents = (
          <div className={styles.stock}>
            {/* <div className={styles.stockSymbol}>{this.state.stockInfo.symbol}</div> */}
            <div className={styles.stockSymbol}>{this.props.title}</div>
            <div>
              <span className={styles.stockTrend}>
                { lastStockData.close > previousClose ?
                <Icon iconName='Up' /> :
                lastStockData.close < previousClose ?
                <Icon iconName='Down' /> :
                null }
              </span>
              <span className={styles.stockValue}>{ parseFloat(lastStockData.close.toString()).toFixed(2) } USD</span>
            </div>
            <div className={styles.stockInfo}>
              {/* <span>{(difference >= 0 ? '+' : '')}{ parseFloat(difference.toString()).toFixed(2) }</span> */}
              {/* <span>({differencePercent >= 0 ? '+' : ''}{ parseFloat(differencePercent.toString()).toFixed(2) }%)</span> */}
              {/* <span>{this.state.stockInfo.lastRefreshed.toLocaleTimeString()}</span> */}
              <span>{new Date(sessionStorage.lastAPITime).toLocaleTimeString()}</span>

            </div>
            {/* <a href={`https://www.msn.com/en-us/money/stockdetails/fi-126.1.${this.state.stockInfo.symbol}.NAS?symbol=${this.state.stockInfo.symbol}&form=PRFIHQ`} className={styles.more} target='_blank'><Icon iconName='NavigateExternalInline'/></a> */}
          </div>
        );
      }
    }
    return (
      <div className={styles.stockInfo}>
        {this.props.needsConfiguration &&
          <Placeholder
            iconName={strings.PlaceholderIconName}
            iconText={strings.PlaceholderIconText}
            description={strings.PlaceholderDescription}
            buttonLabel={strings.PlaceholderButtonLabel}
            onConfigure={this.props.configureHandler} />
        }
        {contents}
      </div>);
  }
}
