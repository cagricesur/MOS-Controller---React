import { StateRow } from "./server";

export interface StateRowExtended extends StateRow {
  max: number;
  enabled: boolean;
}

export interface StateRowExtendedContainer {
  rows: StateRowExtended[];
  date: Date;
}
