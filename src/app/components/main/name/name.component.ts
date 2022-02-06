import { Component, EventEmitter, OnDestroy, OnInit, Output } from "@angular/core";
import { SocketService } from "../../../services/socket.service";
import { DATA_TYPE, PARAM } from "../../../models/param.model";  0
import { RMPlayerRegister } from "../../../models/response.model";
import { PlayerFullData } from "../../../models/player.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'name-component',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class NameComponent implements OnInit, OnDestroy {
  @Output() onRegistered: EventEmitter<boolean> = new EventEmitter<boolean>()

  private subscriptions: Subscription = new Subscription();

  constructor(
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    const registerSubscription = this.socketService.startListeningOn<PlayerFullData>(DATA_TYPE.PLAYER_REGISTER).subscribe(data => {
      data.forEach((d) => {
        if (this.socketService.getPlayerId() === d[PARAM.PLAYER_ID]) {
          this.onRegistered.emit(true)
        }
      });
    });

    this.subscriptions.add(registerSubscription);

    this.formSubmit(Math.random().toString());
    // this.tableSitTo();
  }

  formSubmit(playerName: string): boolean {
    this.socketService.emitPlayerRegister({
      [PARAM.PLAYER_NAME]: playerName
    });
    return false;
  }

  // TODO DEBUG
  tableSitTo(): boolean {
    this.socketService.emitTableSitTo()
    return false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
