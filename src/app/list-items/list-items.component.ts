import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ItemsService } from '../items.service';
import { Item } from '../item';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { NewItemComponent } from '../new-item/new-item.component';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class ListItemsComponent implements OnInit, AfterViewInit {

  items$: any;
  itemList: any[] = [];
  // dataSource = new MatTableDataSource<Item>([]);
  dataSource: any;
  itemLength: number = 0;
  searchText = '';
  timeRange: any[] = [];
  total_amount: number = 0;
  displayedColumns: string[] = ['item', 'shop', 'price', 'category', 'date'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  displayedSubColumns: string[] = ['position', 'name', 'quantity', 'price']
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  expandedElement: any | null;

  constructor(private dialog: MatDialog, private itemsService: ItemsService) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.listItems();
  }

  listItems(): any {
    this.itemsService.getItems().then((itemSnapshot: any) => {
      console.log(itemSnapshot," item snapshot");
      this.itemList = itemSnapshot.docs.map((doc: any) => {
        return { _id: doc.id, ref: doc.ref, ...doc.data() }
      });
      if (this.searchText != '')
        this.searchItem({ target: { value: this.searchText } });
      else {
        this.dataSource = this.itemList;
        this.itemLength = this.dataSource.length;
        this.total_amount = this.dataSource.map((item: any) => item.price).reduce((acc: number, price: number) => acc + ((price && !isNaN(price)) ? Number(price) : 0), 0);
      }
    });
  }

  subItemDataSource(subItems: any): any {
    let i: number = 0;
    return subItems.map((item: any) => { return { ...item, index: ++i } });
  }

  openModal(element: any = null) {
    const dialogRef = this.dialog.open(NewItemComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      this.listItems();
    })
  }

  validNum(price: any): boolean {
    return price && !isNaN(price);
  }

  searchItem(event: any): void {
    this.searchText = event.target.value.toLowerCase();
    this.dataSource = this.itemList.filter(item => {
      return (item.item.toLowerCase().includes(this.searchText) || item.category.toLowerCase().includes(this.searchText));
    });
    this.itemLength = this.dataSource.length;
    this.total_amount = this.dataSource.map((item: any) => item.price).reduce((acc: number, price: number) => acc + ((price && !isNaN(price)) ? Number(price) : 0), 0);
  }

  clearSearch(): void {
    this.searchText = '';
    this.dataSource = this.itemList;
    this.itemLength = this.dataSource.length;
    this.total_amount = this.itemList.map(item => item.price).reduce((acc, price) => acc + ((price && !isNaN(price)) ? Number(price) : 0), 0);
  }
}
