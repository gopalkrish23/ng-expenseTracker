import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgxMatDatetimePickerModule, 
  NgxMatNativeDateModule, 
  NgxMatTimepickerModule 
} from '@angular-material-components/datetime-picker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewItemComponent } from './new-item/new-item.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableResponsiveDirective } from './mat-table-responsive.directive';
import { MaterialModule } from './material-module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    NewItemComponent,
    ListItemsComponent,
    MatTableResponsiveDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxMatDatetimePickerModule, 
    NgxMatNativeDateModule, 
    NgxMatTimepickerModule,
  ],
  providers: [{
    provide: MAT_DIALOG_DATA, useValue: {},
  }, {
    provide: MatDialogRef, useValue: {}
  }],
  bootstrap: [AppComponent]
})
export class AppModule {}
