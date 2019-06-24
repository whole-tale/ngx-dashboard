import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~/app/framework/core';
import { MaterialModule } from '~/app/framework/material';

import { RunTaleComponent } from './run-tale.component';
import { routes } from './run-tale.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule],
  declarations: [RunTaleComponent]
})
export class RunTaleModule {}
