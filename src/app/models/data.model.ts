export enum DATA_KEY {
  REGISTER_PLAYER = '0',
  PLAYER_CHANGE = '1'
}

export enum DATA_PARAM {
  PLAYER_ID = 0,
  DATA = 1,
  NAME = 2
}

// Data received model
export interface DataRModel<D> {
  [DATA_PARAM.PLAYER_ID]: string;
  [DATA_PARAM.DATA]: D;
}

export type DataSType = DMPlayerChange

export interface DMPlayerChange {
  [DATA_PARAM.NAME]?: string;
}
