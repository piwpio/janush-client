import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { RMGameEndData } from "../../../models/response.model";
import { PARAM } from "../../../models/param.model";

@Component({
  selector: 'end-game-modal',
  templateUrl: './end-game-modal.component.html',
  styleUrls: ['./end-game-modal.component.scss'],
})
export class EndGameModalComponent {
  public PARAM = PARAM;

  constructor(
    public dialogRef: MatDialogRef<EndGameModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RMGameEndData,
  ) {}
}
