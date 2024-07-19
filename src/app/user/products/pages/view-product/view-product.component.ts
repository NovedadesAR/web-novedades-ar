import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { Products } from '../../interfaces/products.interface';
import { SendDataCard } from '../../interfaces/SendDataCard.interface';
import { CompraProducto } from '../../interfaces/CompraProduct.iinterface';
import { MessageService } from 'primeng/api';
import { MLoginService } from '../../../modulo-login/services/m-login.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrl: './view-product.component.css'
})
export class ViewProductComponent implements OnInit {
  constructor(
    private routerLink: ActivatedRoute,
    private productsService: ProductsService,
    private router: Router,
    private messageService: MessageService,
    private loginService: MLoginService
  ) { }
  id!: string;
  rating:number = 0;
  product: Products = {
    id: 0,
    nombre_producto: "",
    precio: 0,
    descripccion: "",
    stock: 0,
    categoria: '',
    rating: 0,
    descuento: 0,
    status: '',
    imagen: [],
    tipo: '',
    comentarios: []
  };
  isLoader: boolean = true;
  cantidad: number = 1;
  imagenCarrucel: string = "";
  ngOnInit(): void {
    this.id = this.routerLink.snapshot.paramMap.get('id')!;
    this.productsService.getProductById(this.id).subscribe(data => {
      this.product = data
      this.rating = data.rating;
      setTimeout(() => {
        this.isLoader = false;
      }, 500);
      this.imagenCarrucel = data.imagen[0].url_imagen;
    });
  }
  addProductToCard() {
    const idUser = localStorage.getItem('token');

    if (idUser !== null) {
      const dataCard: SendDataCard = {
        cantidad: 1,
        idProduct: parseInt(this.id,),
        idUser: parseInt(idUser)
      }
      this.productsService.addProductToCard(dataCard).subscribe(data => {
        if (data.status === 200) {
          this.messageService.add({
            severity: 'success',
            detail: 'Producto agregado al carrito'
          })
        }
        else if (data.status === 409) {
          this.messageService.add({
            severity: 'warn',
            detail: 'El producto ya esta en el carrito'
          })
        }
      })
    }
    else {
      this.messageService.add({
        severity: 'warn',
        detail: 'Debes iniciar sesion para poder agregar al carrito'
      })
    }
  }

  async comprarProduct() {
    let id = localStorage.getItem('token');
    if (id !== null) {
      this.loginService.checkUbicacion(id).subscribe(resp => {
        if (resp.status === 404) {
          return this.messageService.add({
            severity: 'warn',
            detail: 'Debes agregar tus datos de envio para poder comprar'
          })
        }
        if (this.loginService.checkLogin()) {
          return this.messageService.add(
            {
              severity: 'warn',
              detail: 'Debes iniciar sesion para poder comprar el producto'
            }
          )
        }
        this.router.navigate(['compra/', this.id]);
        localStorage.setItem('product', this.id);
        localStorage.setItem('cantidad', this.cantidad.toString());
      })
    }
  }

  changeCantidad(value: string) {
    switch (value) {
      case '+':
        this.cantidad++;
        ;
        break;
      case '-':
        this.cantidad--;
        break;
    }
  }

  changeImgCarrucel(id: number) {
    for (let i = 0; i < this.product.imagen.length; i++) {
      if (id === this.product.imagen[i].id) {
        this.imagenCarrucel = this.product.imagen[i].url_imagen;
      }
    }

  }
  calDes(precio:number,descuento:number){
    let dato = precio - (precio * descuento/100);
    return Math.floor(dato);
  }
}
