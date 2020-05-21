import { Injectable, OnInit, EventEmitter, Inject, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwellObject } from './models/swellobject';


export interface SwellConfig {
  defaultSwellDomain: string;
}

export const SwellConfigService = new InjectionToken<SwellConfig>('SwellConfig');

declare let swell: any;

@Injectable({
  providedIn: 'root'
})
export class SwellService {

  private defaultSwellDomain = 'swell.justplaybo.it'; // TODO define as environment property

  private api: any = swell.runtime.get();

  /** nullable, hot */
  session$ = new BehaviorSubject<any>(null);

  /** hot */
  status$ = new BehaviorSubject<string>(swell.Constants.STATUS_DISCONNECTED);
  statusError = null;

  object: any; // the current object

  auth: any;

  loginEvents: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private snackBar: MatSnackBar,
    @Inject(SwellConfigService) private config: SwellConfig
  ) {
    this.defaultSwellDomain = config.defaultSwellDomain;

    this.updateSessionSubject();

    this.api.addConnectionHandler((status, err) => {
      this.status$.next(status);
      this.statusError = err;
      console.log('Swell status ' + status);
      if (err) {
        console.log(err);
      }
    });

  }

  getSwellDomain() {
    try {
      return this.api.getAppDomain();
    } catch {
      return this.defaultSwellDomain;
    }
  }

  startSession() {
    return this.api.login(this.auth)
      .then(profile => {
        this.snackBar.open('Login success for ' + profile.id, 'Close', { duration: 3000 });
        return profile.id;
      }).catch(err => {
        this.snackBar.open('Login error', 'Close', { duration: 3000 });
      })
      .finally(() => {
        this.updateSessionSubject();
      });

  }




  /**
   * End current session iff is not anonymous
   */
  endSession() {

    if (this.api.profilesManager.getCurrentParticipantId() &&
      !this.api.profilesManager.getCurrentProfile().anonymous) {

      return this.api.logout({
        id: this.api.profilesManager.getCurrentParticipantId().address
      }).finally(() => {
        this.updateSessionSubject();
      });

    } else {
      return Promise.resolve();
    }

  }

  /**
   * Re-start last session saved in browser
   */
  resumeSession() {

    return this.api.resume({})
      .then(profile => {
      })
      .catch(err => {
        return this.api.login({});
      })
      .finally(() => {
        this.updateSessionSubject();
      });

  }

  createUser(userid, password, properties) {
    return this.api.createUser({
      id: userid,
      password
    })
      .then(profile => {
        this.snackBar.open('Account created for ' + profile.id, 'Close', { duration: 3000 });
      })
      .catch(err => {
        this.snackBar.open('Error creating account', 'Close', { duration: 3000 });
      });
  }

  login(userid, password) {
    this.auth = { id: userid, password };
    return this.api.login(this.auth)
      .then(profile => {
        this.snackBar.open('Account created for ' + profile.id, 'Close', { duration: 3000 });
      }).catch(ex => { });
  }

  anon() {
    this.auth = {};
    return this.api.login(this.auth)
      .then(profile => {
        this.snackBar.open('Account created for ' + profile.id, 'Close', { duration: 3000 });
      }).catch(ex => { });
  }

  createObject(presence = true) {
    return this.api.open({}).then(ob => {
      if (!ob.node('state')) {
        ob.set('state', '_created_');
        ob.setPublic(true);
      }

      if (presence) {
        this.enablePresence(ob);
      }
      this.snackBar.open('Object created: ' + ob.id, 'Close', { duration: 3000 });
      return ob;
    }).catch(ex => { });
  }

  getObject(objectId, presence= true) {

    this.snackBar.open(`getting game ${objectId}`);
    // TODO check id syntax
    return this.api.open({
      id: objectId
    })
      .then(ob => {
        if (!ob.node('state')) {
          ob.setPublic(true);
        }
        
        if (presence) {
          this.enablePresence(ob);
        }
        this.snackBar.open('Object opened: ' + ob.id, 'Close', { duration: 3000 });
        return ob;
      }).catch(ex => { });
  }


  public enablePresence(object) {

    object.setPresence(true);
    object.setPresenceHandler((event) => {
      console.log(event.session.id + ' is ' + event.type);
    });

    object.trackPresence(true);
  }

  /**
   * Propagate session info
   */
  private updateSessionSubject() {

    if (this.api.profilesManager.getCurrentParticipantId()) {
      this.session$.next({
        id: this.api.profilesManager.getCurrentSessionId(),
        profile: this.api.profilesManager.getCurrentProfile(),
        registered: !this.api.profilesManager.getCurrentProfile().anonymous
      });
    } else {
      this.session$.next(null);
    }


  }

}
