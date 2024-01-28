import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MindmapComponent } from './mindmap.component';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MindmapRoutingModule } from './mindmap-routing.module';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        ScrollPanelModule,
        ToastModule,
        MindmapRoutingModule
    ],
    declarations: [MindmapComponent]
})
export class MindmapModule { }
