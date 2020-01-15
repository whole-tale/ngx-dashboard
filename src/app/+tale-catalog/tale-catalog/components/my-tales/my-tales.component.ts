import { Component } from '@angular/core';
import { Tale } from '@api/models/tale';
import { User } from '@api/models/user';
import { TokenService } from '@api/token.service';

import { PublicTalesComponent } from '../public-tales/public-tales.component';

@Component({
  templateUrl: './my-tales.component.html',
  styleUrls: ['./my-tales.component.scss'],
  selector: 'app-my-tales'
})
export class MyTalesComponent extends PublicTalesComponent {
  
}
