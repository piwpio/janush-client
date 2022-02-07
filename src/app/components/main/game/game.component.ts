import { Component, ElementRef, HostListener, OnDestroy, OnInit } from "@angular/core";
import { SocketService } from "../../../services/socket.service";
import { DATA_TYPE, PARAM } from "../../../models/param.model";
import {
  RMepleChangeData, RMGameEndData,
  RMGameInitData,
  RMGameMepleCollectData,
  RMGameUpdateData
} from "../../../models/response.model";
import { Subscription } from "rxjs";
import { MOVE_DIRECTION } from "../../../models/types.model";
import { EndGameModalComponent } from "../end-game-modal/end-game-modal.component";
import { MatDialog } from "@angular/material/dialog";

enum KEYS {
  ARROW_LEFT = 'ArrowLeft',
  ARROW_RIGHT = 'ArrowRight',
  ARROW_DOWN = 'ArrowDown',
  ARROW_UP = 'ArrowUp',
  LOWER_W = 'w',
  LOWER_A = 'a',
  LOWER_S = 's',
  LOWER_D = 'd',
  UPPER_W = 'W',
  UPPER_A = 'A',
  UPPER_S = 'S',
  UPPER_D = 'D',
  SPACEBAR = ' ',
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
  private playerNo: number;
  private playerLastFieldIndex: number;
  private roundItems: HTMLElement[];
  private roundItemsDisabled: HTMLElement[];

  constructor(
    private el: ElementRef,
    private socketService: SocketService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.backBoardFields = this.el.nativeElement.querySelector('#back-board-container').querySelectorAll('.field');
    this.boardFields = this.el.nativeElement.querySelector('#board-container').querySelectorAll('.field');
    this.meplesFields = [this.boardFields[0], this.boardFields[18]]
    this.roundItems = this.el.nativeElement.querySelectorAll('.round-item');
    this.roundItemsDisabled = this.el.nativeElement.querySelectorAll('.round-item .disabled');


    const gameSubscription = this.socketService.startListeningOn<RMGameInitData>(DATA_TYPE.GAME_INIT).subscribe(data => {
      data.forEach(d => {
        this.playerNo = d[PARAM.GAME_PLAYERS].findIndex(
          player => player?.[PARAM.PLAYER_ID] === this.socketService.getPlayerId()
        );
        this.isPlayerPlaying = this.playerNo > -1;
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

    const gameEndSubscription = this.socketService.startListeningOn<RMGameEndData>(DATA_TYPE.GAME_END).subscribe(data => {
        this.openGameEndModal(data[0]);
    });

    const mepleChangeSubscription = this.socketService.startListeningOn<RMepleChangeData>(DATA_TYPE.MEPLE_CHANGE).subscribe(data => {
      data.forEach(d => {
        this.playerLastFieldIndex = d[PARAM.MEPLE_FIELD_INDEX];
        this.meplesFields[d[PARAM.MEPLE_ID]].style.backgroundImage = 'none';
        this.meplesFields[d[PARAM.MEPLE_ID]] = this.boardFields[d[PARAM.MEPLE_FIELD_INDEX]];
        this.meplesFields[d[PARAM.MEPLE_ID]].style.backgroundImage =
          `url("./assets/graphics/player${d[PARAM.MEPLE_ID]}.png")`;
      });
    });

    this.subscriptions.add(gameSubscription);
    this.subscriptions.add(gameChangeSubscription);
    this.subscriptions.add(gameMepleCollectSubscription);
    this.subscriptions.add(gameEndSubscription);
    this.subscriptions.add(mepleChangeSubscription);
  }

  private fillRoundItems(roundItems: RMGameUpdateData[PARAM.GAME_ROUND_ITEMS]): void {
    roundItems
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

  private openGameEndModal(modalData: RMGameEndData): void {
    if (!modalData[PARAM.GAME_WINNER] || !modalData[PARAM.GAME_LOSER]) return;

    this.dialog.open(EndGameModalComponent, { data: modalData });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.isPlayerPlaying) return;
    // MY LOVELY WIFE FRIENDLY CONTROLS
    if (this.isCollect(event)) {
      this.socketService.emitMepleCollect();

    } else if (this.playerLastFieldIndex > 0 && this.playerLastFieldIndex < 8) {
      if (this.isArrowRight(event))       this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
      else if (this.isArrowLeft(event))   this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);

    } else if (this.playerLastFieldIndex > 9 && this.playerLastFieldIndex < 17) {
      if (this.isArrowDown(event))        this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
      else if (this.isArrowUp(event))     this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);

    } else if (this.playerLastFieldIndex > 18 && this.playerLastFieldIndex < 26) {
      if (this.isArrowLeft(event))        this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
      else if (this.isArrowRight(event))  this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);

    } else if (this.playerLastFieldIndex > 27 && this.playerLastFieldIndex < 35) {
      if (this.isArrowUp(event))          this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
      else if (this.isArrowDown(event))   this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);

    } else if (this.playerLastFieldIndex === 0) {
      if (this.isArrowRight(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
      else if (this.isArrowLeft(event) || this.isArrowDown(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);

    } else if (this.playerLastFieldIndex === 8) {
      if (this.isArrowRight(event) || this.isArrowDown(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
      else if (this.isArrowLeft(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);

    } else if (this.playerLastFieldIndex === 9) {
      if (this.isArrowDown(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
      else if (this.isArrowUp(event) || this.isArrowLeft(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);

    } else if (this.playerLastFieldIndex === 17) {
      if (this.isArrowDown(event) || this.isArrowLeft(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
      else if (this.isArrowUp(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);

    } else if (this.playerLastFieldIndex === 18) {
      if (this.isArrowLeft(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
      else if (this.isArrowRight(event) || this.isArrowUp(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);

    } else if (this.playerLastFieldIndex === 26) {
      if (this.isArrowLeft(event) || this.isArrowUp(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
      else if (this.isArrowRight(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);

    } else if (this.playerLastFieldIndex === 27 ) {
      if (this.isArrowUp(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
      else if (this.isArrowRight(event) || this.isArrowDown(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);
    } else if (this.playerLastFieldIndex === 35) {
      if (this.isArrowUp(event) || this.isArrowRight(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
      else if (this.isArrowDown(event))
        this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);
    }

    // OLD FASHION CONTROLLS
    // if (this.isOldFashionCollect(event)) this.socketService.emitMepleCollect();
    // else if (this.isArrowLeft(event)) this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);
    // else if (this.isArrowRight(event)) this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);
  }

  private isArrowRight(event: KeyboardEvent): boolean {
    return event.key === KEYS.ARROW_RIGHT || event.key === KEYS.LOWER_D || event.key === KEYS.UPPER_D
  }
  private isArrowLeft(event: KeyboardEvent): boolean {
    return event.key === KEYS.ARROW_LEFT || event.key === KEYS.LOWER_A || event.key === KEYS.UPPER_A
  }
  private isArrowDown(event: KeyboardEvent): boolean {
    return event.key === KEYS.ARROW_DOWN || event.key === KEYS.LOWER_S || event.key === KEYS.UPPER_S
  }
  private isArrowUp(event: KeyboardEvent): boolean {
    return event.key === KEYS.ARROW_UP || event.key === KEYS.LOWER_W || event.key === KEYS.UPPER_W
  }
  private isOldFashionCollect(e: KeyboardEvent): boolean {
    return e.key === KEYS.SPACEBAR || e.key === KEYS.ARROW_DOWN || e.key === KEYS.LOWER_S || e.key === KEYS.UPPER_S
  }
  private isCollect(e: KeyboardEvent): boolean {
    return e.key === KEYS.SPACEBAR
  }


  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
