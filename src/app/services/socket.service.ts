import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { GATEWAY, PayloadChairPlayerIsReady, PayloadPlayerRegister } from "../models/gateway.model";
import { map, filter, Observable } from "rxjs";
import { ResponseDataModel, ResponseDataType, ResponseModel, ResponseType } from "../models/response.model";
import { DATA_TYPE, PARAM } from "../models/param.model";

@Injectable()
export class SocketService {
  constructor(
    public socket: Socket
  ) {}

  startListeningOn<T>(dataType: DATA_TYPE): Observable<T[]> {
    return this.socket.fromEvent<ResponseType>(GATEWAY.MAIN).pipe(
      map(response => {
        return response
          .filter(res => res[PARAM.DATA_TYPE] === dataType)
          .map(res => res[PARAM.DATA]) as T[];
      }),
      filter(response => response.length > 0)
    );
  }

  startDebugListening(): void {
    this.socket.fromEvent(GATEWAY.MAIN).subscribe(data => {
      const str = JSON.stringify(data, null, 2);
      console.log('#########################################################');
      console.log(new Date());
      console.log(str);
    });
    this.socket.fromEvent(GATEWAY.EXCEPTION).subscribe(data => {
      console.error(data);
    });
  }

  private emit(dataKey: GATEWAY, data: any): void {
    this.socket.emit(dataKey, data);
  }

  emitPlayerRegister(payload: PayloadPlayerRegister): void {
    this.emit(GATEWAY.PLAYER_REGISTER, payload);
  }

  emitTableSitTo(): void {
    this.emit(GATEWAY.TABLE_SIT_TO, {});
  }

  emitTableStandFrom(): void {
    this.emit(GATEWAY.TABLE_STAND_FROM, {});
  }

  emitChairPlayerIsReady(payload: PayloadChairPlayerIsReady): void {
    this.emit(GATEWAY.CHAIR_PLAYER_SET_READY, payload);
  }
}
