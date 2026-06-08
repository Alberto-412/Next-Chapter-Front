import { Component, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-admin',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar-admin.html',
  styleUrl: './sidebar-admin.css',
})
export class SidebarAdmin {

  menuOpen: boolean = false;

  @Output() menuToggled = new EventEmitter<boolean>();

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.menuToggled.emit(this.menuOpen);
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}