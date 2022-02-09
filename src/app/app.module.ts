import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NameComponent } from "./components/main/name/name.component";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { SocketService } from "./services/socket.service";
import { MainComponent } from "./components/main/main.component";
import { ChairComponent } from "./components/main/chair/chair.component";
import { ActionsComponent } from "./components/main/actions/actions.component";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from "@angular/material/button";
import { GameComponent } from "./components/main/game/game.component";
import { EndGameModalComponent } from "./components/main/end-game-modal/end-game-modal.component";
import { MatDialogModule } from "@angular/material/dialog";
import { ConfigService } from "./services/config.service";
import { ChatComponent } from "./components/main/chat/chat.component";

const config: SocketIoConfig = { url: 'http://192.168.0.192:8080' };

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NameComponent,
    ChairComponent,
    ActionsComponent,
    GameComponent,
    ChatComponent,
    EndGameModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config),
    NoopAnimationsModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [SocketService, ConfigService],
  bootstrap: [AppComponent]
})
export class AppModule { }
