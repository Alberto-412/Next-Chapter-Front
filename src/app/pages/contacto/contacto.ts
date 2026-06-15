import { Component } from '@angular/core';
import { FormularioContacto } from '../../component/formularioContacto/formularioContacto';

@Component({
  selector: 'app-contacto',
  imports: [FormularioContacto],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {}
