import { LobbyComponent } from './lobby/lobby.component';
import { GameComponent } from './game/game.component';
import { NewComponent } from './new/new.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: LobbyComponent },
  { path: ':game/new', component: NewComponent },
  { path: ':game/:id', component: GameComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
