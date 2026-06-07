import { Component, inject } from '@angular/core';
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

  onBuscar(event: Event) {
    const termino = (event.target as HTMLInputElement).value;
    this.busquedaService.buscar(termino);
  }
}