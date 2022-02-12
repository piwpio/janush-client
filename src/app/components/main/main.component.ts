import { Component } from "@angular/core";
import { SocketService } from "../../services/socket.service";
import { GENERAL_ID } from "../../models/types.model";

@Component({
  selector: 'main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public GENERAL_ID = GENERAL_ID;
  public isPlayerRegistered = false;
  public isDisconnected = false;

  constructor(
    private socketService: SocketService
  ) {
    this.socketService.onDisconnect().subscribe(() => {
      this.isPlayerRegistered = false;
      this.isDisconnected = true;
    });
    this.socketService.onConnect().subscribe(() => {
      this.isDisconnected = false;
    });
    // this.socketService.startDebugListening();
  }
}
