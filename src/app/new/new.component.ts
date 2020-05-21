import { ShareComponent } from './../share/share.component';
import { SygService } from './../syg.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private world: SygService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const game = this.route.snapshot.params.game;

    this.world.login('', '').then(ex => {
      this.world.create().then(wid => {
        const wwid = wid.split('/')[1];
        console.log(wwid);
        setTimeout(x => {
          this.router.navigate(['/' + game, wwid]);
          this.dialog.open(ShareComponent, { data: {game, id: wwid }});
          setTimeout(y => {
            window.location.href = window.location.href;
          }, 200);
        }, 3000);
      }).catch(ex1 => { });
    }).catch(ex => { });


  }

}
