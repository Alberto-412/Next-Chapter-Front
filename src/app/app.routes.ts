import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';


// Admin
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

export const routes: Routes = [

  // Rutas públicas (sin guard)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  // aquí irán home, catalogo, producto...


  // Rutas admin (protegidas con adminGuard)
  { path: 'admin/dashboard', component: Dashboard, canActivate: [adminGuard] },
  { path: 'admin/productos', component: Productos, canActivate: [adminGuard] },
  { path: 'admin/pedidos', component: Pedidos, canActivate: [adminGuard] },
  { path: 'admin/usuarios', component: Usuarios, canActivate: [adminGuard] },

  // Rutas usuario (protegidas con authGuard)
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: 'wishlist', component: Wishlist, canActivate: [authGuard] },
  { path: 'reviews', component: Reviews, canActivate: [authGuard] },

  // Ruta por defecto
  { path: '', redirectTo: 'catálogo', pathMatch: 'full' }

];