import {IPersonalemailWebPartProps} from "../PersonalemailWebPart";
import { MSGraphClient } from "@microsoft/sp-http";
import { DisplayMode } from "@microsoft/sp-core-library";

export interface IPersonalemailProps extends IPersonalemailWebPartProps{
  displayMode: DisplayMode;
  graphClient: MSGraphClient;
  updateProperty: (value: string) => void;
}
