import { Component } from '@angular/core';
import { producerNotifyConsumers } from '@angular/core/primitives/signals';
import { RouterOutlet } from '@angular/router';
import {ProductosComponent } from './productos/productos';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductosComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'Proyecto_EcoVision_S.A';
}
