import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '~/app/framework/core';
import { MaterialModule } from '~/app/framework/material';

import { ComputeEnvironmentsComponent } from './compute-environments.component';
import { routes } from './compute-environments.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule],
  declarations: [ComputeEnvironmentsComponent]
})
export class ComputeEnvironmentsModule { }

