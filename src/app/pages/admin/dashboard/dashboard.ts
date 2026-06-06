import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  pedidos: any[] = [];
  usuariosPendientes: any[] = [];
  error: string = '';

  constructor(private adminService: AdminService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.adminService.getDashboard().subscribe({
      next: (data: any) => {
        this.pedidos = [...data.pedidos];
        this.usuariosPendientes = [...data.usuariosPendientes];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.error = 'Error al cargar el dashboard'
      }
    });
  }
}