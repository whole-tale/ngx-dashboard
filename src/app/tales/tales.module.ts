import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TalesService } from '@tales/tales.service';

@NgModule({
  declarations: [],
  exports: [],
  providers: [TalesService],
  imports: [CommonModule]
})
export class TalesModule {}
