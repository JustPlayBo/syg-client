import { SwellService } from './swell.service';
import { Injectable, EventEmitter } from '@angular/core';
import { take, first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

declare const swell;

@Injectable({
  providedIn: 'root'
})
export class SygService {

  world: any;
  loggedin = false;
  session;

  markerChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private swellService: SwellService,
    private http: HttpClient
  ) { }

  login(username, password) {
    return this.swellService.anon().then(dd => {
      this.loggedin = true;
      this.swellService.startSession();
    }).catch(ex => { });
  }

  createUser(username, password) {
    return this.swellService.createUser(username, password, {});
  }

  open(worldId) {
    if (this.session) {
      this.loadObject(worldId);
    } else {
      // we must wait for the swell session
      this.swellService.session$.pipe(first(val => val != null))
        .subscribe(session => {
          this.session = session;
          this.loadObject(worldId);
        });

    }
  }

  create() {
    return this.swellService.createObject().then(object => {
      this.world = object;
      return object.id;
    }).catch(ex => {
      console.log('error during world opening');
      console.error(ex);
    });
  }

  addMarkerListeners() {
    this.world.node('markers').addListener((event: any) => {
      const ev = this.world.node('markers').get();
      this.markerChanged.emit(ev);
      return false;
    });
  }


  loadObject(worldId) {
    return this.swellService.getObject(worldId).then(object => {
      this.world = object;

      if (!this.world.node('markers')) {
        this.world.set('markers', swell.Map.create());
      }
    }).catch(ex => {
      console.log('error during world opening');
      console.error(ex);
    });
  }


  moveMarker(name, position) {
    if (!this.world.node('markers')) {
      this.world.set('markers', swell.Map.create());
    }
    this.world.node('markers').put(name, JSON.stringify(position));
  }

  getState() {
    return this.world.node('markers').get();
  }

  getGame(name) {
    return this.http.get(`/assets/games/${name}.json`);
  }

  getGames() {
    return this.http.get(`/assets/games.json`);
  }
}

