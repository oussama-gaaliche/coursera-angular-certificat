import { Component, Inject, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';

import { LeaderService } from '../services/leader.service';
import { flyInOut,expand } from '../animations/app.animation';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),
      expand()
    ]
})
export class AboutComponent implements OnInit {
  leaders: Leader[] ;
  selectedLeader: Leader;
  errMess: string;
  constructor(private LeaderService: LeaderService,@Inject('BaseURL') public BaseURL) { }

  ngOnInit(): void {
    this.LeaderService.getLeaders().subscribe(leaderss=>this.leaders=leaderss, errmess=>this.errMess= <any>errmess);
  }
  onSelect(leader: Leader) {
    this.selectedLeader = leader;
    }
    
}
