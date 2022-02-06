import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { SocketService } from "../../../services/socket.service";
import { DATA_TYPE, PARAM } from "../../../models/param.model";
import { RMChairChangeData } from "../../../models/response.model";
import { GENERAL_ID } from "../../../models/types.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'chair-component',
  templateUrl: './chair.component.html',
  styleUrls: ['./chair.component.scss']
})
export class ChairComponent implements OnInit, OnDestroy {
  @Input() chairId: GENERAL_ID;

  private subscriptions: Subscription = new Subscription()

  public playerName: string;
  public playerWin: number;
  public playerWinstreak: number;
  public playerLost: number;
  public playerMaxWinstreak: number;
  public playerIsReady: boolean;

  constructor(
    private socketService: SocketService
  ) {
    this.resetChair();
  }

  ngOnInit(): void {
    const chairSubscription = this.socketService.startListeningOn<RMChairChangeData>(DATA_TYPE.CHAIR_CHANGE).subscribe(data => {
      data.forEach(d => {
        if (d[PARAM.CHAIR_ID] !== this.chairId) return;
        if (!d[PARAM.CHAIR_PLAYER]) {
          this.resetChair();
          return;
        }

        const playerData = d[PARAM.CHAIR_PLAYER];
        this.playerName = playerData[PARAM.PLAYER_NAME];
        this.playerWin = playerData[PARAM.PLAYER_WIN_COUNTER];
        this.playerLost = playerData[PARAM.PLAYER_LOST_COUNTER];
        this.playerWinstreak = playerData[PARAM.PLAYER_WINSTREAK];
        this.playerMaxWinstreak = playerData[PARAM.PLAYER_MAX_WINSTREAK];
        this.playerIsReady = d[PARAM.CHAIR_PLAYER_IS_READY];
      });
    });

    this.subscriptions.add(chairSubscription);
  }

  private resetChair(): void {
    this.playerName = '';
    this.playerWinstreak = 0;
    this.playerMaxWinstreak = 0;
    this.playerIsReady = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
