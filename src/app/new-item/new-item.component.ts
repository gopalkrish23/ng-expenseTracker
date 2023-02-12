import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  newItem!: FormGroup;
  categories!: string[];

  constructor(private itemService: ItemsService, @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, public dialogRef: MatDialogRef<NewItemComponent>, private fb: FormBuilder) {
    this.maxDate = new Date().getDate() + 1;
    this.categories = ['Groceries', 'Vegetables', 'Fruits', 'Medical', 'Hotel Foods', 'Recharge', 'Learning', 'Dress', 'Others'];
  }

  ngOnInit(): void {
    this.newItem = new FormGroup({
      item: this.fb.control('', [Validators.required]),
      shop: this.fb.control(''),
      price: this.fb.control('', [Validators.required]),
      category: this.fb.control('', [Validators.required]),
      date: this.fb.control('', [Validators.required]),
      subItems: this.fb.array([]),
    });
    if (this.data && this.data.subItems && this.data.subItems.length)
      this.initSubItems(this.data.subItems);
    this.setForm(this.data);
  }

  get subItems(): FormArray {
    return <FormArray>this.newItem.get('subItems');
  }

  initSubItems(subProduct: any): void {
    for (let i = 0; i < subProduct.length; i++)
      this.pushSubItem();
  }

  pushSubItem(): void {
    this.subItems.push(this.newSubItem());
  }

  newSubItem(): FormGroup {
    return this.fb.group({
      name: this.fb.control('', [Validators.required]),
      price: this.fb.control('', [Validators.required]),
      quantity: this.fb.control('', [Validators.required])
    })
  }

  getSubItems(subProduct: any[]): any {
    let items = [];
    for (let i = 0; i < subProduct.length; i++)
      items.push({
        name: subProduct[i].name ? subProduct[i].name : '',
        price: subProduct[i].price ? subProduct[i].price : '',
        quantity: subProduct[i].quantity ? subProduct[i].quantity : ''
      });
    return items;
  }

  setForm(data: any): void {
    if (data)
      this.newItem.patchValue({
        item: data.item ? data.item : '',
        shop: data.shop ? data.shop : '',
        price: data.price ? data.price : '',
        category: data.category ? data.category : '',
        date: data.date ? new Date(data.date.seconds * 1000) : '',
        subItems: data.subItems ? this.getSubItems(data.subItems) : []
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: "end",
      verticalPosition: "top"
    })
  }

  saveItem(): any {
    const formValue = this.newItem.getRawValue();
    formValue.updated_on = new Date();
    if (this.data) {
      this.itemService.editItem(this.data.ref, formValue).then((res: any) => {
        this.openSnackBar('the item updated successfully', 'dismiss');
        this.dialogRef.close();
      });
      return;
    }
    formValue.created_on = new Date();
    this.itemService.addItem(formValue).then((res: any) => {
      this.dialogRef.close();
      this.openSnackBar('the item saved successfully', 'dismiss');
    })
  }

  deleteItem() {
    this.itemService.deleteItem(this.data.ref).then(result => {
      this.dialogRef.close();
    });
  }

  cancelItem() {
    this.dialogRef.close();
  }

}