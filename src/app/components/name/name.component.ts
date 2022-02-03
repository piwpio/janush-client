import { Component } from "@angular/core";
import { SocketService } from "../../services/socket.service";
import { PARAM } from "../../models/param.model";

@Component({
  selector: 'name-component',
  templateUrl: './name.component.html'
})
export class NameComponent {
  private isPlayerReady = false;

  constructor(
    private socketService: SocketService
  ) {
    this.socketService.startListening();
  }

  registerPlayer(playerName: string): boolean {
    this.socketService.emitPlayerRegister({
      [PARAM.PLAYER_NAME]: playerName
    });
    return false;
  }

  tableSitTo(): boolean {
    this.socketService.emitTableSitTo()
    return false;
  }

  tableStandFrom(): boolean {
    this.socketService.emitTableStandFrom();
    return false;
  }

  tablePlayerIsReady(): boolean {
    this.isPlayerReady = !this.isPlayerReady;
    this.socketService.emitChairPlayerIsReady({
      [PARAM.CHAIR_PLAYER_IS_READY]: this.isPlayerReady
    });
    return false;
  }
}
