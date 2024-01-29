import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MindmapComponent } from './mindmap.component';
import { ButtonModule } from 'primeng/button';
import { MindmapRoutingModule } from './mindmap-routing.module';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        ScrollPanelModule,
        TableModule,
        DialogModule,
        ToastModule,
        MindmapRoutingModule
    ],
    declarations: [MindmapComponent]
})
export class MindmapModule { }
