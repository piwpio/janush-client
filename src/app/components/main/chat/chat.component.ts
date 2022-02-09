import { Component, OnDestroy, OnInit } from "@angular/core";
import { SocketService } from "../../../services/socket.service";
import { DATA_TYPE, PARAM } from "../../../models/param.model";
import { RMChatChangeData } from "../../../models/response.model";
import { Subscription } from "rxjs";
import { CHAT_MESSAGE_MAXLENGTH } from "../../../models/config.model";

@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  public messages: RMChatChangeData[] = [];
  public PARAM = PARAM;
  public CHAT_MESSAGE_MAXLENGTH = CHAT_MESSAGE_MAXLENGTH;

  constructor(
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    const chatSubscription = this.socketService.startListeningOn<RMChatChangeData>(DATA_TYPE.CHAT_CHANGE).subscribe(data => {
      data.forEach((d: RMChatChangeData) => {
        this.messages.push(d);
        this.messages.slice(0, 50);
      });
    });

    this.subscriptions.add(chatSubscription);
  }

  submitMessage(message: string, input: HTMLInputElement): boolean {
    this.socketService.emitChatMessage(message);
    input.value = '';
    return false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
