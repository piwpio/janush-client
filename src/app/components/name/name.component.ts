import { Component } from "@angular/core";
import { DATA_KEY, DATA_PARAM } from "../../models/data.model";
import { SocketService } from "../../services/socket.service";

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
    this.socketService.emit(DATA_KEY.REGISTER_PLAYER, { [DATA_PARAM.NAME]: userName });
    return false;
  }
}
