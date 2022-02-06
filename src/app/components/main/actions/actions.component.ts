import { Component, OnDestroy, OnInit } from "@angular/core";
import { SocketService } from "../../../services/socket.service";
import { DATA_TYPE, PARAM } from "../../../models/param.model";
import { RMChairChangeData } from "../../../models/response.model";
import { Subscription } from "rxjs";

@Component({
  selector: 'actions-component',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription()

  constructor(
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.socketService.startListeningOn<RMChairChangeData>(DATA_TYPE.CHAIR_CHANGE).subscribe(data => {
        data.forEach(d => {
          if (!d[PARAM.CHAIR_PLAYER]) return;
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
