import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist implements OnInit {

  wishlist: any[] = [];
  mensaje: string = '';
  error: string = '';

  constructor(private usuarioService: UsuarioService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarWishlist();
  }

  cargarWishlist() {
    this.usuarioService.getWishlist().subscribe({
      next: (data: any) => {
        this.wishlist = [...data];
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error al cargar la lista de deseos'
    });
  }

  eliminarDeFavoritos(bookId: number) {
    this.usuarioService.removeFromWishlist(bookId).subscribe({
      next: () => {
        this.mensaje = 'Libro eliminado de favoritos';
        this.cargarWishlist();
      },
      error: () => this.error = 'Error al eliminar el libro de favoritos'
    });
  }
}