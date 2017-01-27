import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { Game } from './game/game';
import { Preview } from './game/editor/preview';
import { AssetsLoader } from './game/service/assetsLoader'
import { EditorViewComponent } from './game/editor-view.component';
import { Editor } from './game/editor/editor';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    JsonpModule
  ],
  declarations: [
    AppComponent,
    EditorViewComponent,
    Editor,
    Preview
  ],
  providers: [
    AssetsLoader
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }