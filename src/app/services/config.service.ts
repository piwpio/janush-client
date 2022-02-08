import { Injectable } from "@angular/core";
import { CONTROL_TYPE } from "../models/config.model";
import { BehaviorSubject, distinctUntilChanged, Observable } from "rxjs";

@Injectable()
export class ConfigService {
  private controlType$: BehaviorSubject<CONTROL_TYPE> = new BehaviorSubject<CONTROL_TYPE>(CONTROL_TYPE.LOVELY_WIFEY);

  setControlType(type: CONTROL_TYPE): void {
    this.controlType$.next(type);
  }

  onControlTypeChange(): Observable<CONTROL_TYPE> {
    return this.controlType$.asObservable().pipe(distinctUntilChanged());
  }
}
