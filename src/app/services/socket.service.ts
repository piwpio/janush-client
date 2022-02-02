import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { DATA_KEY, DataRModel, DataSType, DMPlayerChange } from "../models/data.model";

@Injectable()
export class SocketService {
  constructor(
    private socket: Socket
  ) {}

  startListening(): void {
    this.socket.fromEvent<DataRModel<DMPlayerChange>>(DATA_KEY.PLAYER_CHANGE).subscribe(data => {
      console.log(data);
    });
  }

  emit(dataKey: DATA_KEY, data: DataSType): void {
    this.socket.emit(dataKey, data);
  }
}
