import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { GATEWAY, PayloadRegisterPlayer } from "../models/gateway.model";

@Injectable()
export class SocketService {
  constructor(
    private socket: Socket
  ) {}

  startListening(): void {
    this.socket.fromEvent(GATEWAY.GAME).subscribe(data => {
      console.log(data);
    });
  }

  private emit(dataKey: GATEWAY, data: any): void {
    this.socket.emit(dataKey, data);
  }

  emitRegisterPlayer(payload: PayloadRegisterPlayer): void {
    this.emit(GATEWAY.REGISTER_PLAYER, payload);
  }
}
