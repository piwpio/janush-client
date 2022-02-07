import { Component, ElementRef, HostListener, OnDestroy, OnInit } from "@angular/core";
import { SocketService } from "../../../services/socket.service";
import { DATA_TYPE, PARAM } from "../../../models/param.model";
import {
  RMepleChangeData,
  RMGameInitData,
  RMGameMepleCollectData,
  RMGameUpdateData
} from "../../../models/response.model";
import { Subscription } from "rxjs";
import { MOVE_DIRECTION } from "../../../models/types.model";

enum KEYS {
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  ARROW_DOWN = 'ArrowDown',
  LOWER_A = 'a',
  LOWER_D = 'd',
  LOWER_S = 's',
  UPPER_A = 'A',
  UPPER_D = 'D',
  UPPER_S = 'S',
}

@Component({
  selector: 'game-component',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription()

  private backBoardFields: HTMLElement[];
  private boardFields: HTMLElement[];
  private meplesFields: HTMLElement[] = [];
  private isPlayerPlaying: boolean = false;
  private roundItems: HTMLElement[];
  private roundItemsDisabled: HTMLElement[];

  constructor(
    private el: ElementRef,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.backBoardFields = this.el.nativeElement.querySelector('#back-board-container').querySelectorAll('.field');
    this.boardFields = this.el.nativeElement.querySelector('#board-container').querySelectorAll('.field');
    this.meplesFields = [this.boardFields[0], this.boardFields[18]]
    this.roundItems = this.el.nativeElement.querySelectorAll('.round-item');
    this.roundItemsDisabled = this.el.nativeElement.querySelectorAll('.round-item .disabled');


    const gameSubscription = this.socketService.startListeningOn<RMGameInitData>(DATA_TYPE.GAME_INIT).subscribe(data => {
      data.forEach(d => {
        this.isPlayerPlaying = d[PARAM.GAME_PLAYERS].some(player => {
          if (!player) return false;
          return player[PARAM.PLAYER_ID] === this.socketService.getPlayerId();
        });
        this.fillBackBoardFields(d[PARAM.GAME_FIELDS]);
      });
    });

    const gameChangeSubscription = this.socketService.startListeningOn<RMGameUpdateData>(DATA_TYPE.GAME_UPDATE).subscribe(data => {
      data.forEach(d => {
        this.fillRoundItems(d[PARAM.GAME_ROUND_ITEMS]);
      });
    });

    const gameMepleCollectSubscription = this.socketService.startListeningOn<RMGameMepleCollectData>(DATA_TYPE.GAME_MEPLE_COLLECT).subscribe(data => {
      data.forEach(d => {
        this.fillRoundItems(d[PARAM.GAME_ROUND_ITEMS]);
      });
    });

    const mepleChangeSubscription = this.socketService.startListeningOn<RMepleChangeData>(DATA_TYPE.MEPLE_CHANGE).subscribe(data => {
      data.forEach(d => {
        this.meplesFields[d[PARAM.MEPLE_ID]].style.backgroundImage = 'none';
        this.meplesFields[d[PARAM.MEPLE_ID]] = this.boardFields[d[PARAM.MEPLE_FIELD_INDEX]];
        this.meplesFields[d[PARAM.MEPLE_ID]].style.backgroundImage =
          `url("./assets/graphics/player${d[PARAM.MEPLE_ID]}.png")`;
      });
    });

    this.subscriptions.add(gameSubscription);
    this.subscriptions.add(gameChangeSubscription);
    this.subscriptions.add(gameMepleCollectSubscription);
    this.subscriptions.add(mepleChangeSubscription);
  }

  private fillRoundItems(roundItems: RMGameUpdateData[PARAM.GAME_ROUND_ITEMS]): void {
    console.log(roundItems);
    this.roundItems.forEach((item: HTMLElement, index: number) => {
      item.style.backgroundImage = `url("./assets/graphics/${Math.abs(roundItems[index])}.png")`;
      if (roundItems[index] < 0) {
        this.roundItemsDisabled[index].style.display = 'block'
      } else {
        this.roundItemsDisabled[index].style.display = 'none'
      }
    });
  }

  private fillBackBoardFields(fields: RMGameUpdateData[PARAM.GAME_ROUND_ITEMS]): void {
    this.backBoardFields.forEach((field: HTMLElement, index: number) => {
      field.style.backgroundImage = `url("./assets/graphics/${fields[index]}.png")`;
    });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.isPlayerPlaying) return;

    if (event.key === KEYS.ARROW_LEFT || event.key === KEYS.LOWER_A || event.key === KEYS.UPPER_A) {
      this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);

    } else if (event.key === KEYS.ARROW_RIGHT || event.key === KEYS.LOWER_D || event.key === KEYS.UPPER_D) {
      this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);

    } else if (event.key === KEYS.ARROW_DOWN || event.key === KEYS.LOWER_S || event.key === KEYS.UPPER_S) {
      this.socketService.emitMepleCollect();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
