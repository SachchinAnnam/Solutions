import { IMessage } from '.';

export interface IPersonalemailState {
  error: string;
  loading: boolean;
  messages: IMessage[];
}