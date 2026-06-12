import { Component, inject, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarAdmin } from '../../../component/sidebar-admin/sidebar-admin';
import { BusquedaService } from '../../../services/busqueda.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, SidebarAdmin],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
  private busquedaService = inject(BusquedaService);

  menuOpen = false;
  isMobile = window.innerWidth <= 768;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  get searchPlaceholder(): string {
    return this.isMobile ? 'Buscar' : 'Buscar ...';
  }

  onMenuToggled(isOpen: boolean) {
    this.menuOpen = isOpen;
  }

  onBuscar(event: Event) {
    const termino = (event.target as HTMLInputElement).value;
    this.busquedaService.buscar(termino);
  }
}