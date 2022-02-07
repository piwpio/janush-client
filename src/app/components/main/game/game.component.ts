import { Component, ElementRef, HostListener, OnDestroy, OnInit } from "@angular/core";
import { SocketService } from "../../../services/socket.service";
import { DATA_TYPE, PARAM } from "../../../models/param.model";
import { RMepleChangeData, RMGameInitData } from "../../../models/response.model";
import { Subscription } from "rxjs";
import { MOVE_DIRECTION } from "../../../models/types.model";

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

  constructor(
    private el: ElementRef,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.backBoardFields = this.el.nativeElement.querySelector('#back-board-container').querySelectorAll('.field');
    this.boardFields = this.el.nativeElement.querySelector('#board-container').querySelectorAll('.field');
    this.meplesFields = [this.boardFields[0], this.boardFields[18]]

    const gameSubscription = this.socketService.startListeningOn<RMGameInitData>(DATA_TYPE.GAME_INIT).subscribe(data => {
      data.forEach(d => {
        this.isPlayerPlaying = d[PARAM.GAME_PLAYERS].some(player => {
          if (!player) return false;
          return player[PARAM.PLAYER_ID] === this.socketService.getPlayerId();
        });
        console.log(d[PARAM.GAME_FIELDS]);
        this.fillBackBoardFields(d[PARAM.GAME_FIELDS])
      });
    });

    const meplesSubscription = this.socketService.startListeningOn<RMepleChangeData>(DATA_TYPE.MEPLE_CHANGE).subscribe(data => {
      data.forEach(d => {
        this.meplesFields[d[PARAM.MEPLE_ID]].style.backgroundImage = 'none';
        this.meplesFields[d[PARAM.MEPLE_ID]] = this.boardFields[d[PARAM.MEPLE_FIELD_INDEX]]
        this.meplesFields[d[PARAM.MEPLE_ID]].style.backgroundImage =
          `url("./assets/graphics/player${d[PARAM.MEPLE_ID]}.png")`;
      });
    });

    this.subscriptions.add(gameSubscription);
    this.subscriptions.add(meplesSubscription);
  }

  private fillBackBoardFields(fields: RMGameInitData[PARAM.GAME_FIELDS]): void {
    this.backBoardFields.forEach((field: HTMLElement, index: number) => {
      field.style.backgroundImage = `url("./assets/graphics/${fields[index]}.png")`;
    })
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.isPlayerPlaying) return;

    if (event.key === 'ArrowLeft' || event.key === 'a' || event.key === 'A') {
      this.socketService.emitMepleMove(MOVE_DIRECTION.DESC);

    } else if (event.key === 'ArrowRight' || event.key === 'd' || event.key === 'D') {
      this.socketService.emitMepleMove(MOVE_DIRECTION.ASC);

    } else if (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') {
      this.socketService.emitMepleCollect();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
