import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@shared/material/material.module';
import { SharedModule } from '@shared/shared.module';
import { TalesModule } from '@tales/tales.module';

import { ComputeEnvironmentsComponent } from './compute-environments.component';
import { routes } from './compute-environments.routes';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes), SharedModule, MaterialModule, TalesModule],
  declarations: [ComputeEnvironmentsComponent]
})
export class ComputeEnvironmentsModule { }
