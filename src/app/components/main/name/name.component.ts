import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { SocketService } from "../../../services/socket.service";
import { DATA_TYPE, PARAM } from "../../../models/param.model";
import { PlayerFullData } from "../../../models/player.model";
import { Subscription } from "rxjs";
import { NAME_MAXLENGTH } from "../../../models/config.model";

@Component({
  selector: 'name-component',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class NameComponent implements OnInit, OnDestroy {
  @Input() isDisconnected: boolean;
  @Output() onRegistered: EventEmitter<boolean> = new EventEmitter<boolean>()

  private subscriptions: Subscription = new Subscription();

  public NAME_MAXLENGTH = NAME_MAXLENGTH;

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

    // this.formSubmit(Math.random().toString().substring(0, 10));
  }

  formSubmit(playerName: string): boolean {
    if (this.isDisconnected) return false;

    this.socketService.emitPlayerRegister(playerName);
    return false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
