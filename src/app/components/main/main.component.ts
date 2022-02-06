import { Component } from "@angular/core";
import { SocketService } from "../../services/socket.service";
import { GENERAL_ID } from "../../models/types.model";

@Component({
  selector: 'main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public GENREAL_ID = GENERAL_ID;
  public isPlayerRegistered = false;

  // TODO DEBUG
  constructor(
    private socketService: SocketService
  ) {
    this.socketService.startDebugListening();
  }
}
