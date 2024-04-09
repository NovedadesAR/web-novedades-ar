import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardComponent } from './pages/card/card.component';
import { ProductsComponent } from './pages/products/products.component';
import { ViewProductComponent } from './pages/view-product/view-product.component';
import { ScreenCompraComponent } from './pages/screen-compra/screen-compra.component';

const routes: Routes = [
  {
    path: 'carrito',
    component: CardComponent
  },
  {
    path: 'productos',
    component: ProductsComponent
  },
  {
    path:'view/:id',
    component: ViewProductComponent
  },
  {
    path:'compra/:id',
    component:ScreenCompraComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
