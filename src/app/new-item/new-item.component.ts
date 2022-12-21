import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { ItemsService } from '../items.service';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.css']
})
export class NewItemComponent implements OnInit {

  minDate!: any;
  maxDate!: any;
  disabled: boolean = false;
  showSpinners: boolean = true;
  showSeconds: boolean = false;
  stepHour: number = 1;
  stepMinute: number = 1;
  stepSecond: number = 1;
  touchUi: boolean = true;
  color: ThemePalette = 'primary';
  enableMeridian: boolean = true;
  disableMinute: boolean = false;
  hideTime: boolean = false;
  newItem = new FormGroup({
    item: new FormControl(''),
    price: new FormControl(''),
    category: new FormControl(''),
    date: new FormControl('')
  });

  constructor(private itemService: ItemsService, @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<NewItemComponent>,) { 
    this.setForm(data);
    this.maxDate = new Date().getDate()+1;
  }

  ngOnInit(): void {}
  
  setForm(data: any): void {
    if(data)
      this.newItem.setValue({
        item: data.name ? data.name : '',
        price: data.price ? data.price : '',
        category: data.category ? data.category : '',
        date: data.date ? data.date : ''
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: "end",
      verticalPosition: "top"
    })
  }

  saveItem(): any{
    const formValue = this.newItem.getRawValue();
    console.log(formValue," form value ",this.data);
    if(this.data){
      this.itemService.editItem(this.data.ref, formValue).then((res: any) => {
        this.openSnackBar('the item updated successfully', 'dismiss');
        this.dialogRef.close();
      });
      return;
    }
    this.itemService.addItem(formValue).then((res: any) =>{
      this.dialogRef.close();
      this.openSnackBar('the item saved successfully', 'dismiss');
    })
  }

  deleteItem(){
    this.itemService.deleteItem(this.data.ref).then(result=>{
      this.dialogRef.close();
    });
  }

}