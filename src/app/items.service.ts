import { Injectable } from '@angular/core';

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, addDoc, updateDoc, orderBy, query, startAt, limit, startAfter } from 'firebase/firestore/lite';
import { Item } from './item';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private app: any = initializeApp(environment.firebaseConfig);
  db: any = getFirestore(this.app);

  itemsCollection: any;
  items$: any;
  constructor() {
    this.itemsCollection = collection(this.db, 'items');
  }

  addItem(formValue: any){
    return addDoc(this.itemsCollection, formValue);
  }

  async getItems(){
    const collectionRef = collection(this.db, 'items');
    const query1 = query(collectionRef, orderBy("date", 'desc'));
    return (await getDocs(query1));
  }

  deleteItem(docRef: any){
    console.log(docRef," doc ref to delete");
    return deleteDoc(docRef);
  }

  editItem(docRef: any, data: any){
    console.log(docRef," doc ref to edit ",data);
    return updateDoc(docRef, data);
  }
}
