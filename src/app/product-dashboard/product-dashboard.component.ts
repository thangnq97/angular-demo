import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductAPIService } from '../api/product-api.service';
import { ProductModel } from './product.model';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.css']
})
export class ProductDashboardComponent implements OnInit{

  formValue !: FormGroup;
  productObj : ProductModel = new ProductModel();
  productData !: any;
  showAdd !: boolean;
  showEdit !: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private api: ProductAPIService
    ) {}

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      name : [''],
      price : [''],
      image : ['']
    })

    this.getAllProduct();
  }

  clickAddProduct() {
    this.formValue.reset();
    this.showAdd = true;
    this.showEdit = false;
  }

  postProductDetail() {
    this.productObj.name = this.formValue.value.name;
    this.productObj.price = this.formValue.value.price;
    this.productObj.image = this.formValue.value.image;

    this.api.postProduct(this.productObj).subscribe(res => {
      console.log(res);
      alert('Product added successfully!!');
      const cancel = document.getElementById("cancel");
      cancel?.click();
      this.formValue.reset();
      this.getAllProduct();
    },
    err => {
      alert('Something went wrong');
    })
  }

  getAllProduct() {
    this.api.getProduct().subscribe(res => {
      this.productData = res;
    })
  }

  deleteProduct(item: any) {
    const conf = confirm("Are you sure?");
    if(conf) {
      this.api.deleteProduct(item.id).subscribe(res => {
        alert('Product deleted');
        this.getAllProduct();
      })
    }
  }

  editProduct(item: any) {
    this.showAdd = false;
    this.showEdit = true;

    this.productObj.id = item.id;
    this.formValue.controls['name'].setValue(item.name);
    this.formValue.controls['price'].setValue(item.price);
    this.formValue.controls['image'].setValue(item.image);
  }

  updateProduct() {
    this.productObj.name = this.formValue.value.name;
    this.productObj.price = this.formValue.value.price;
    this.productObj.image = this.formValue.value.image;

    this.api.updateProduct(this.productObj, this.productObj.id).subscribe(res => {
      alert('Update successfully');
      const cancel = document.getElementById("cancel");
      cancel?.click();
      this.getAllProduct();
      this.formValue.reset();
    })
  }

  resetForm() {
    this.formValue.reset();
  }
}
