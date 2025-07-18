import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit,OnDestroy, viewChild } from '@angular/core';
import { get } from 'http';

/*
Define la interfaz Producto que describe la estructura de un producto
con propiedades como id, nombre, precio, descripcion e imagen.
*/
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
}

@Component({
  selector: 'app-productos',
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit, AfterViewInit, OnDestroy {
@ViewChild('ContenedorProductos') contenedorProductos!: ElementRef;
@ViewChild('ItemsProductos') itemsProductos!: ElementRef;

//Lista de productos que se mostrarán en la aplicación
productos: Producto[] = [
  {
    id: 1,
    nombre: 'Producto 1',
    precio: 100,
    descripcion: 'Descripción del Producto 1',
    imagen: 'https://via.placeholder.com/150'
  },
  {
    id: 2,
    nombre: 'Producto 2',
    precio: 200,
    descripcion: 'Descripción del Producto 2',
    imagen: 'https://via.placeholder.com/150'
  },
  {
    id: 3,
    nombre: 'Producto 3',
    precio: 300,
    descripcion: 'Descripción del Producto 3',
    imagen: 'https://via.placeholder.com/150'
  },
  {id: 4,
    nombre: 'Producto 4',
    precio: 400,
    descripcion: 'Descripción del Producto 4',
    imagen: 'https://via.placeholder.com/150'
  },
  {
    id: 5,
    nombre: 'Producto 5',
    precio: 500,
    descripcion: 'Descripción del Producto 5',
    imagen: 'https://via.placeholder.com/150'
  },
  {
    id: 6,
    nombre: 'Producto 6',
    precio: 600,
    descripcion: 'Descripción del Producto 6',
    imagen: 'https://via.placeholder.com/150'
  },
  {
    id: 7,
    nombre: 'Producto 7',
    precio: 700,
    descripcion: 'Descripción del Producto 7',
    imagen: 'https://via.placeholder.com/150'
  },
  {
    id: 8,
    nombre: 'Producto 8',
    precio: 800,
    descripcion: 'Descripción del Producto 8',
    imagen: 'https://via.placeholder.com/150'
  }
];

//Navega a la página de detalles del producto seleccionado
indiceActual=0;
ItemsEnVista=4;
PuedeIrIzquierda=false;
PuedeIrDerecha=true;
puntos: number[] = [];
PuntoIndiceActual=0;

//Lazyloading para cargar los productos de manera diferida
ImagenCargada = new Set<number>();
ObservadorIntersection!: IntersectionObserver;

//Actualiza los puntos indicadores según la cantidad de productos
ngOnInit(): void {
    this.ActualizarPuntosIndicadores();
    this.ColocarObservadorIntersection();
}

//Actualiza los botones de navegación según la posición actual
ngAfterViewInit(): void {
    this.ActualizaBotonesNavegacion();
    this.MiraImagenesCargadas();
}

//Elimina el observador de intersección al destruir el componente
ngOnDestroy(): void {
    if(this.ObservadorIntersection){
        this.ObservadorIntersection.disconnect();
    }
}

//Configura el observador de intersección para detectar cuando las imágenes entran en vista
private ColocarObservadorIntersection(): void {
  this.ObservadorIntersection = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        const imagen = entrada.target as HTMLImageElement;
        const productoId = parseInt(imagen.closest('ItemProducto')?.getAttribute('data-id') || '0');
        if(productoId && !this.ImagenCargada.has(productoId)) {
          this.ImagenCarga(productoId);

        }
      }
    });
  },
  {
    root: this.contenedorProductos.nativeElement,
    rootMargin: '50px', // Margen para cargar imágenes antes de que estén completamente visibles
    threshold: 0.1 // Carga la imagen cuando al menos el 10% es visible
  });
}
//Observa las imágenes dentro del contenedor de productos
private MiraImagenesCargadas(): void {
  const imagenes= this.itemsProductos.nativeElement.querySelectorAll('ImagenProducto');
  imagenes.forEach((img:HTMLImageElement)=>{
    this.ObservadorIntersection.observe(img);
  });
}

//Simula la carga de una imagen y marca el producto como cargado
private ImagenCarga(productoId: number): void {
setTimeout(() => {
  this.ImagenCargada.add(productoId);
},500);
}

//Se optimiza la función del ngFor para evitar la creación de puntos innecesarios
RastrearPorProducto(index: number, producto: Producto): number {
  return producto.id;
}

//Obtiene el URL de la imagen o su placeholder si no está cargada
ConsigueImagenFuente(Producto: Producto): string {
  return this.EstáCargada(Producto.id) ? Producto.imagen : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+';
}

//Verifica si la imagen del producto está cargada
EstáCargada(productoId: number): boolean {
  return this.ImagenCargada.has(productoId);
}

//Si carga la imagen de forma exitosa
Cargando(event:Event):void{
  const imagen= event.target as HTMLImageElement;
  imagen.style.opacity = '1'; // Hace visible la imagen
}

//Si no carga la imagen de forma exitosa
Error(event:Event):void{
  const imagen= event.target as HTMLImageElement;
  imagen.src='https://via.placeholder.com/400x300?text=Error+loading+image'
}

//Navegar a la izquierda en la lista de productos
MoverIzquierda(): void {
  if (this.PuedeIrIzquierda) {
    this.indiceActual = Math.max(0, this.indiceActual - this.ItemsEnVista);
    this.ActualizaYTransforma();
    this.ActualizaBotonesNavegacion();
    this.ActualizaPuntoActual();
  }
}

//Navegar a la derecha en la lista de productos
  MoverDerecha(): void {
    if (this.PuedeIrDerecha) {
      this.indiceActual = Math.min(this.productos.length - this.ItemsEnVista, this.indiceActual + this.ItemsEnVista);
      this.ActualizaYTransforma();
      this.ActualizaBotonesNavegacion();
      this.ActualizaPuntoActual();
    }
  }

  //Navega a la sección específica
  IrAlPunto(PuntoIndice: number): void {
    this.indiceActual = PuntoIndice * this.ItemsEnVista;
    this.ActualizaYTransforma();
    this.ActualizaBotonesNavegacion();
    this.ActualizaPuntoActual();
  }

  //Actualiza la transformación del CSS para mostrar los productos visibles
  private ActualizaYTransforma(): void {
    const AnchoProducto=300; // Ancho de cada producto
    const CambioX=-(this.indiceActual * AnchoProducto);
    this.itemsProductos.nativeElement.style.transform = `translateX(${CambioX}px)`;
  }

//Actualiza los botones de navegación según la posición actual
private ActualizaBotonesNavegacion(): void {
  this.PuedeIrIzquierda= this.indiceActual > 0;
  this.PuedeIrDerecha= this.indiceActual < this.productos.length - this.ItemsEnVista;
}

//Actualiza los puntos indicadores según la cantidad de productos
private ActualizarPuntosIndicadores(): void {
  const PuntosTotales= Math.ceil(this.productos.length / this.ItemsEnVista);
  this.puntos= Array.from({ length: PuntosTotales }, (_, i) => i);
}

//Actualiza el indice del punto actual según la posición de los productos
private ActualizaPuntoActual(): void {
this.PuntoIndiceActual = Math.floor(this.indiceActual / this.ItemsEnVista);
}


}
