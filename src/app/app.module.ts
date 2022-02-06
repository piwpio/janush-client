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

const config: SocketIoConfig = { url: 'http://192.168.0.192:8080' };

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NameComponent,
    ChairComponent,
    ActionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
