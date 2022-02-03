import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { GATEWAY, PayloadChairPlayerIsReady, PayloadPlayerRegister } from "../models/gateway.model";

@Injectable()
export class SocketService {
  constructor(
    private socket: Socket
  ) {}

  startListening(): void {
    this.socket.fromEvent(GATEWAY.GAME).subscribe(data => {
      console.log(data);
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

  emitTableSit(): void {
    this.emit(GATEWAY.TABLE_SIT, {});
  }

  emitChairPlayerIsReady(payload: PayloadChairPlayerIsReady): void {
    this.emit(GATEWAY.CHAIR_PLAYER_IS_READY, payload);
  }
}
