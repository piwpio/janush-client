import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SocketService } from "../../../services/socket.service";
import { DATA_TYPE, PARAM } from "../../../models/param.model";  0
import { RMPlayerRegister } from "../../../models/response.model";
import { PlayerFullData } from "../../../models/player.model";

@Component({
  selector: 'name-component',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class NameComponent implements OnInit {
  @Output() onRegistered: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.socketService.startListeningOn<PlayerFullData>(DATA_TYPE.PLAYER_REGISTER).subscribe(data => {
      data.forEach((d) => {
        if (this.socketService.socket.ioSocket.id === d[PARAM.PLAYER_ID]) {
          this.onRegistered.emit(true)
        }
      });
    });

    this.formSubmit('Janusz');
    this.tableSitTo();
  }

  formSubmit(playerName: string): boolean {
    this.socketService.emitPlayerRegister({
      [PARAM.PLAYER_NAME]: playerName
    });
    return false;
  }

  tableSitTo(): boolean {
    this.socketService.emitTableSitTo()
    return false;
  }
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
