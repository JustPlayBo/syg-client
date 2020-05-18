import { Router } from '@angular/router';
import { SygService } from './../syg.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  games;

  constructor(
    private syg: SygService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.syg.getGames().subscribe(data => {
      this.games = data;
    });
  }

  join(game) {
    const gname = prompt('Insert code');
    this.router.navigate([game, gname]);
  }

}
