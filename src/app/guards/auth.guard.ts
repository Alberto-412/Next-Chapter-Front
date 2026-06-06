import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


// Guard para rutas que requieren autenticación
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};


// Guard para rutas que requieren rol de admin
export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Decodificamos el token para ver el rol
  const payload = JSON.parse(atob(token.split('.')[1]));

  if (payload.rol !== 'admin') {
    router.navigate(['/']);
    return false;
  }

  return true;
};