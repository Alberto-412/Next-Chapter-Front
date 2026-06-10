import { Routes } from '@angular/router';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { MyOrders } from './pages/my-orders/my-orders';
import { OrderDetail } from './pages/order-detail/order-detail';

export const routes: Routes = [
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'orders', component: MyOrders },
  { path: 'orders/:id', component: OrderDetail},
];