import { Component } from "@angular/core";
import { SocketService } from "../../services/socket.service";
import { PARAM } from "../../models/param.model";

@Component({
  selector: 'name-component',
  templateUrl: './name.component.html'
})
export class NameComponent {
  constructor(
    private socketService: SocketService
  ) {
    this.socketService.startListening();
  }

  submitName(userName: string) {
    this.socketService.emitRegisterPlayer({
      [PARAM.NAME]:userName }
    );
    return false;
  }
}
