import { Component, OnDestroy, OnInit } from "@angular/core";
import { SocketService } from "../../../services/socket.service";
import { DATA_TYPE, PARAM } from "../../../models/param.model";
import { RMChairChangeData, RMTableChangeData } from "../../../models/response.model";
import { Subscription } from "rxjs";
import { GENERAL_ID } from "../../../models/types.model";

@Component({
  selector: 'actions-component',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription()

  private chairLastChange: RMChairChangeData[] = [];

  public isPlayerOnChair: boolean = false;
  public isPlayerReady: boolean = false;
  public isAnyChairFree: boolean = false;
  public isUserInQueue: boolean = false;

  constructor(
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    const chairSubscription = this.socketService.startListeningOn<RMChairChangeData>(DATA_TYPE.CHAIR_CHANGE).subscribe(data => {
      data.forEach(d => {
        this.chairLastChange[d[PARAM.CHAIR_ID]] = d;

        const playerChairData = this.getPlayerChair();
        if (playerChairData) {
          this.isPlayerOnChair = true;
          this.isPlayerReady = playerChairData[PARAM.CHAIR_PLAYER_IS_READY];

        } else {
          this.isPlayerOnChair = false;
          console.log(
            'chair 1 free: ', !this.chairLastChange[GENERAL_ID.ID1]?.[PARAM.CHAIR_PLAYER],
            'chair 2 free: ', !this.chairLastChange[GENERAL_ID.ID2]?.[PARAM.CHAIR_PLAYER]
          );
          this.isAnyChairFree =
            !this.chairLastChange[GENERAL_ID.ID1]?.[PARAM.CHAIR_PLAYER] ||
            !this.chairLastChange[GENERAL_ID.ID2]?.[PARAM.CHAIR_PLAYER];
        }

      });
    });

    const tableSubscription = this.socketService.startListeningOn<RMTableChangeData>(DATA_TYPE.TABLE_CHANGE).subscribe(data => {
      data.forEach(d => {
        if (this.getPlayerChair()) {
          this.isUserInQueue = false;
        } else {
          this.isUserInQueue =
            d[PARAM.TABLE_QUEUE].some(queuePlayer => queuePlayer[PARAM.PLAYER_ID] === this.socketService.getPlayerId());
        }
      });
    });

    this.subscriptions.add(chairSubscription);
    this.subscriptions.add(tableSubscription);
  }

  tableSitTo(): boolean {
    this.socketService.emitTableSitTo()
    return false;
  }

  tableStandFrom(): void {
    this.socketService.emitTableStandFrom();
  }

  toggleReady(): void {
    this.socketService.emitChairPlayerIsReady({
      [PARAM.CHAIR_PLAYER_IS_READY]: !this.isPlayerReady
    });
  }

  private getPlayerChair(): RMChairChangeData {
    const playerId = this.socketService.getPlayerId();
    if (this.chairLastChange[GENERAL_ID.ID1]?.[PARAM.CHAIR_PLAYER]?.[PARAM.PLAYER_ID] === playerId) {
      return this.chairLastChange[GENERAL_ID.ID1]
    }
    if (this.chairLastChange[GENERAL_ID.ID2]?.[PARAM.CHAIR_PLAYER]?.[PARAM.PLAYER_ID] === playerId) {
      return this.chairLastChange[GENERAL_ID.ID2]
    }
    return null;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
