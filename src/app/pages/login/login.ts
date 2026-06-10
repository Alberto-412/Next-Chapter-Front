import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  datos = {
    mail: '',
    contrasena: ''
  };

  error: string = '';

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  login() {
    const body = {
      mail: this.datos.mail,
      contraseña: this.datos.contrasena
    };

    this.usuarioService.login(body).subscribe({
      next: (data: any) => {
        localStorage.setItem('token', data.token);
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        if (payload.rol === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/perfil']);
        }
      },
      error: (err: any) => this.error = err.error?.message || 'Error al iniciar sesión'
    });
  }
}