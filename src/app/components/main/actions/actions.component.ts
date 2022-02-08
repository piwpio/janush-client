import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { SocketService } from "../../../services/socket.service";
import { DATA_TYPE, PARAM } from "../../../models/param.model";
import {
  RMChairChangeData,
  RMGameEndData,
  RMGameInitData,
  RMTableChangeData
} from "../../../models/response.model";
import { Subscription } from "rxjs";
import { GENERAL_ID } from "../../../models/types.model";

@Component({
  selector: 'actions-component',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription()
  private buttons: HTMLElement[];
  private chairLastChange: RMChairChangeData[] = [];

  public isPlayerOnChair: boolean = false;
  public isPlayerReady: boolean = false;
  public isAnyChairFree: boolean = false;
  public isPlayerInQueue: boolean = false;
  public isGameOn: boolean = false;
  public playerQueuePosition: number;

  constructor(
    private socketService: SocketService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.buttons = this.el.nativeElement.querySelectorAll('button');

    const chairSubscription = this.socketService.startListeningOn<RMChairChangeData>(DATA_TYPE.CHAIR_CHANGE).subscribe(data => {
      data.forEach(d => {
        this.chairLastChange[d[PARAM.CHAIR_ID]] = d;

        const playerChairData = this.getPlayerChair();
        if (playerChairData) {
          this.isPlayerOnChair = true;
          this.isPlayerReady = playerChairData[PARAM.CHAIR_PLAYER_IS_READY];

        } else {
          this.isPlayerOnChair = false;
          this.isAnyChairFree =
            !this.chairLastChange[GENERAL_ID.ID1]?.[PARAM.CHAIR_PLAYER] ||
            !this.chairLastChange[GENERAL_ID.ID2]?.[PARAM.CHAIR_PLAYER];
        }
      });
    });

    const tableSubscription = this.socketService.startListeningOn<RMTableChangeData>(DATA_TYPE.TABLE_CHANGE).subscribe(data => {
      data.forEach(d => {
        if (this.getPlayerChair()) {
          this.isPlayerInQueue = false;
        } else {
          const playerQueueIndex = d[PARAM.TABLE_QUEUE]
            .findIndex(queuePlayer => queuePlayer[PARAM.PLAYER_ID] === this.socketService.getPlayerId());
          this.isPlayerInQueue = playerQueueIndex > -1;
          this.playerQueuePosition = playerQueueIndex + 1;
        }
      });
    });

    const gameInitSubscription = this.socketService.startListeningOn<RMGameInitData>(DATA_TYPE.GAME_INIT).subscribe(data => {
      data.forEach(d => {
        this.isGameOn = d[PARAM.GAME_IS_ON];
      });
    });

    const gameEndSubscription = this.socketService.startListeningOn<RMGameEndData>(DATA_TYPE.GAME_END).subscribe(() => {
      this.isGameOn = false;
    });

    this.subscriptions.add(chairSubscription);
    this.subscriptions.add(tableSubscription);
    this.subscriptions.add(gameInitSubscription);
    this.subscriptions.add(gameEndSubscription);
  }

  tableSitTo(): void {
    this.socketService.emitTableSitTo();
    this.blurButtons();
  }

  tableStandFrom(): void {
    this.socketService.emitTableStandFrom();
    this.blurButtons();
  }

  toggleReady(): void {
    this.socketService.emitChairPlayerIsReady(!this.isPlayerReady);
    this.blurButtons();
  }

  private blurButtons(): void {
    this.buttons.forEach(button => {
      button.blur();
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
