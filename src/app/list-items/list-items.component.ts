import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ItemsService } from '../items.service';
import { Item } from '../item';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NewItemComponent } from '../new-item/new-item.component';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})

export class ListItemsComponent implements OnInit, AfterViewInit {

  items$: any;
  itemList: any[] = [];
  // dataSource = new MatTableDataSource<Item>([]);
  dataSource: any;
  itemLength: number = 0;
  searchText = '';
  timeRange: any[] =[];
  total_amount: number = 0;
  displayedColumns: string[] = ['item', 'price', 'category', 'date'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private itemsService: ItemsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(){
    this.listItems();
  }

  listItems(): any{
    this.itemsService.getItems().then((itemSnapshot: any)=>{
      this.itemList = itemSnapshot.docs.map((doc: any) => { 
        return { _id: doc.id, ref: doc.ref, ...doc.data() }
      });
      if(this.searchText !=  '')
        this.searchItem({target:{value: this.searchText}});
      else {
        this.dataSource = this.itemList.sort((a,b) => a.date - b.date);
        this.itemLength = this.dataSource.length;
        this.total_amount = this.dataSource.map((item: any)=> item.price).reduce((acc: number, price: number)=> acc + ((price && !isNaN(price)) ? Number(price) : 0), 0);
      }
    });
  }

  openModal(element: any = null){
    const dialogRef = this.dialog.open(NewItemComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result=>{
      this.listItems();
    })
  }

  validNum(price: any): boolean{
    return price && !isNaN(price);
  }

  searchItem(event: any): void{
    this.searchText = event.target.value.toLowerCase();
    this.dataSource = this.itemList.filter(item => {
      return (item.item.toLowerCase().includes(this.searchText) || item.category.toLowerCase().includes(this.searchText));
    }).sort((a,b) => a.date - b.date);
    this.itemLength = this.dataSource.length;
    this.total_amount = this.dataSource.map((item: any)=> item.price).reduce((acc: number, price: number)=> acc + ((price && !isNaN(price)) ? Number(price) : 0), 0);
  }

  clearSearch(): void{
    this.searchText = '';
    // this.listItems();
    this.dataSource = this.itemList.sort((a, b) => a.date - b.date);
    this.itemLength = this.dataSource.length;
    this.total_amount = this.itemList.map(item=> item.price).reduce((acc, price)=> acc + ((price && !isNaN(price)) ? Number(price) : 0), 0);
  }
}
