import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { GATEWAY, PayloadChairPlayerIsReady, PayloadPlayerRegister } from "../models/gateway.model";

@Injectable()
export class SocketService {
  constructor(
    private socket: Socket
  ) {}

  startListening(): void {
    this.socket.fromEvent(GATEWAY.MAIN).subscribe(data => {
      const str = JSON.stringify(data, null, 2);
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
