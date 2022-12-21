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
  total_amount: number = 0;
  displayedColumns: string[] = ['item', 'price', 'category', 'date'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog, private itemsService: ItemsService) { }

  ngOnInit(): void {}

  ngAfterViewInit(){
    this.listItems();
    // this.dataSource.paginator = this.paginator;
  }

  listItems(): any{
    this.itemsService.getItems().then((itemSnapshot: any)=>{
      this.itemList = itemSnapshot.docs.map((doc: any) => { 
        return { _id: doc.id, ref: doc.ref, ...doc.data() }
      });
      this.dataSource = this.itemList;
      this.total_amount = this.itemList.map(item=> item.price).reduce((acc, price)=> acc + ((price && !isNaN(price)) ? Number(price) : 0), 0);
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
}
