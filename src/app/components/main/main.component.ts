import { Component } from "@angular/core";
import { SocketService } from "../../services/socket.service";
import { PARAM } from "../../models/param.model";

@Component({
  selector: 'main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  public isPlayerRegistered = false;

  // tableSitTo(): boolean {
  //   this.socketService.emitTableSitTo()
  //   return false;
  // }
  //
  // tableStandFrom(): boolean {
  //   this.socketService.emitTableStandFrom();
  //   return false;
  // }
  //
  // tablePlayerIsReady(): boolean {
  //   this.isPlayerReady = !this.isPlayerReady;
  //   this.socketService.emitChairPlayerIsReady({
  //     [PARAM.CHAIR_PLAYER_IS_READY]: this.isPlayerReady
  //   });
  //   return false;
  // }
}
