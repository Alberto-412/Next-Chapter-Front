import { Routes } from '@angular/router';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { MyOrders } from './pages/my-orders/my-orders';
import { OrderDetail } from './pages/order-detail/order-detail';


import { authGuard, adminGuard } from './guards/auth.guard';

// Admin
import { AdminLayout } from './pages/admin/admin-layout/admin-layout';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { Productos } from './pages/admin/productos/productos';
import { Pedidos } from './pages/admin/pedidos/pedidos';
import { Usuarios } from './pages/admin/usuarios/usuarios';

// Usuario
import { Perfil } from './pages/usuario/perfil/perfil';
import { Wishlist } from './pages/usuario/wishlist/wishlist';
import { Reviews } from './pages/usuario/reviews/reviews';

// Login
import { Login } from './pages/login/login';

//catalogo
import { Catalogo } from './pages/catalogo/catalogo';

export const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: Login },

  // Rutas admin con layout y guard
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'productos', component: Productos },
      { path: 'pedidos', component: Pedidos },
      { path: 'usuarios', component: Usuarios },
    ],
  },

  // Rutas usuario
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: 'wishlist', component: Wishlist, canActivate: [authGuard] },
  { path: 'reviews', component: Reviews, canActivate: [authGuard] },

  // Ruta por defecto TEMPORAL XXXXXXXXXXXXXX
  { path: 'XXXXXXXXXXX', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: Catalogo },
  { path: 'catalogo', component: Catalogo },

  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
  { path: 'orders', component: MyOrders },
  { path: 'orders/:id', component: OrderDetail},
];
