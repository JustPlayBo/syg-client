import { ShareComponent } from './../share/share.component';
import { CopyComponent } from './../copy/copy.component';
import { SygService } from './../syg.service';
import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

declare const L;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewChecked {

  map;

  game;

  gameData;

  markers = {};

  toIgnore = '';

  constructor(
    private route: ActivatedRoute,
    private world: SygService,
    private dialog: MatDialog,
  ) { }
  ngAfterViewChecked(): void {

    

  }

  ngOnInit(): void {
    this.world.login('', '');
    const id = this.route.snapshot.params.id;
    this.game = this.route.snapshot.params.game;
    
    this.map = L.map('map', {
      crs: L.CRS.Simple
    });

    this.world.getGame(this.game).subscribe((game: any) => {
      this.gameData = game;
      const map = game.map;
      const bounds = [[0, 0], [map.height, map.width]];
      const image = L.imageOverlay(`/assets/imgs/maps/${map.file}`, bounds).addTo(this.map);
      this.map.fitBounds(bounds);

      game.tokens.forEach((token, idx) => {
        const icon = new L.icon({
          iconUrl: `/assets/imgs/tokens/${token.file}`,
          iconSize: [token.width, token.height],
          iconAnchor: [token.width / 2, token.height / 2]
        });
        for (let i = 0; i < token.amount; i ++ ){
          const mname = token.name + '__' + (i + 1);
          this.markers[mname] = L.marker([token.height * (idx + 1), token.width], { icon, draggable: true, title: token.name});
          this.markers[mname].addTo(this.map);
          this.markers[mname].on('dragstart', (e: any) => {
            this.toIgnore = mname;
          });
          this.markers[mname].on('dragend', (e: any) => {
            this.toIgnore = null;
          });
          this.markers[mname].on('drag', (e: any) => {
            this.world.moveMarker(mname, e.target._latlng);
          });
        }
      });
      this.world.markerChanged.subscribe(marker => {
        this.setState(marker);
      });
      setTimeout(_ => {
        this.world.addMarkerListeners();
      }, 1000);
    });
    this.world.open(id);
    setTimeout(_ => {
      const gs = this.world.getState();
      this.setState(gs);
    }, 1000);

  }

  showCopy() {
    this.dialog.open(CopyComponent, {data: this.gameData.copy});
  }

  shareGame() {
    this.dialog.open(ShareComponent, { data: this.route.snapshot.params });
  }

  setState(marker){
    const k = Object.keys(marker);
    k.forEach(key => {
      if (key !== this.toIgnore) {
        const ll = JSON.parse(marker[key]);
        this.markers[key].setLatLng(ll);
      }
    });
  }

}

