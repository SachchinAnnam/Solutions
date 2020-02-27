import  IFaqListItem  from "../models/IFaqListItem";

export interface IFaqAccordianState{
  status: string;
  items: IFaqListItem[];
  listItems: IFaqListItem[];
  isLoading: boolean;
  loaderMessage: string;
}