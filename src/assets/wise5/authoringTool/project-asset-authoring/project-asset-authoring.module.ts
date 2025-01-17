import { NgModule } from '@angular/core';
import { ProjectAssetAuthoringComponent } from './project-asset-authoring.component';
import { NgxFilesizeModule } from 'ngx-filesize';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DragAndDropModule } from '../../common/drag-and-drop/drag-and-drop.module';

@NgModule({
  declarations: [ProjectAssetAuthoringComponent],
  imports: [
    CommonModule,
    DragAndDropModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    NgxFilesizeModule
  ],
  exports: [ProjectAssetAuthoringComponent],
  bootstrap: [ProjectAssetAuthoringComponent]
})
export class ProjectAssetAuthoringModule {}
