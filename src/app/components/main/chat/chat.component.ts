import { Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { SocketService } from "../../../services/socket.service";
import { DATA_TYPE, PARAM } from "../../../models/param.model";
import { RMChatChangeData } from "../../../models/response.model";
import { Subscription } from "rxjs";
import { CHAT_MESSAGE_MAXLENGTH } from "../../../models/config.model";
import { CHAT_SYSTEM } from '../../../models/types.model';

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  private input: HTMLInputElement;
  private messagesContainer: HTMLElement;

  public messages: RMChatChangeData[] = [];
  public PARAM = PARAM;
  public CHAT_MESSAGE_MAXLENGTH = CHAT_MESSAGE_MAXLENGTH;
  public CHAT_SYSTEM = CHAT_SYSTEM;

  constructor(
    private socketService: SocketService,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.input = this.el.nativeElement.querySelector('input');
    this.messagesContainer = this.el.nativeElement.querySelector('.messages-container');

    const chatSubscription = this.socketService.startListeningOn<RMChatChangeData>(DATA_TYPE.CHAT_CHANGE).subscribe(data => {
      data.forEach((d: RMChatChangeData) => {
        this.messages.push(d);
        this.messages = this.messages.slice(-50);
        this.scrollToBottomIfNeed();
      });
    });

    this.subscriptions.add(chatSubscription);
  }

  submitMessage(message: string): boolean {
    if (!message) return false;

    this.socketService.emitChatMessage(message);
    this.input.value = '';
    return false;
  }

  private scrollToBottomIfNeed(): void {
    setTimeout(() =>{
        this.messagesContainer.scrollTo({ top: this.messagesContainer.scrollHeight, behavior: 'smooth' }, )
    }, 16);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
