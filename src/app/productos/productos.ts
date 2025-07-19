import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

/**
 * Define la interfaz Producto que describe la estructura de un producto
 * con propiedades como id, nombre, precio, descripcion e imagen.
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
export class ProductosComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // Referencias a los elementos del DOM para el contenedor y los items de productos
  @ViewChild('contenedorProductos') contenedorProductos!: ElementRef;
  @ViewChild('itemsProductos') itemsProductos!: ElementRef;

  // Lista de productos que se mostrarán en la aplicación
  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Producto Ecológico 1',
      precio: 100,
      descripcion: 'Descripción del Producto Ecológico 1 con ingredientes naturales',
      imagen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 2,
      nombre: 'Producto Ecológico 2',
      precio: 200,
      descripcion: 'Descripción del Producto Ecológico 2 con certificación orgánica',
      imagen: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 3,
      nombre: 'Producto Ecológico 3',
      precio: 300,
      descripcion: 'Descripción del Producto Ecológico 3 sostenible y natural',
      imagen: 'https://images.unsplash.com/photo-1556909114-8ba03863d4bb?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 4,
      nombre: 'Producto Ecológico 4',
      precio: 400,
      descripcion: 'Descripción del Producto Ecológico 4 libre de químicos',
      imagen: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 5,
      nombre: 'Producto Ecológico 5',
      precio: 500,
      descripcion: 'Descripción del Producto Ecológico 5 biodegradable',
      imagen: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 6,
      nombre: 'Producto Ecológico 6',
      precio: 600,
      descripcion: 'Descripción del Producto Ecológico 6 con empaques reciclables',
      imagen: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 7,
      nombre: 'Producto Ecológico 7',
      precio: 700,
      descripcion: 'Descripción del Producto Ecológico 7 de comercio justo',
      imagen: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 8,
      nombre: 'Producto Ecológico 8',
      precio: 800,
      descripcion: 'Descripción del Producto Ecológico 8 con certificación verde',
      imagen: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&crop=center'
    },
       {
      id: 9,
      nombre: 'Producto Ecológico 9',
      precio: 900,
      descripcion: 'Descripción del Producto Ecológico 8 con certificación verde',
      imagen: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&crop=center'
    },
       {
      id: 10,
      nombre: 'Producto Ecológico 10',
      precio: 1000,
      descripcion: 'Descripción del Producto Ecológico 8 con certificación verde',
      imagen: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&crop=center'
    }
  ];

  // Variables de control de navegación
  indiceActual = 0;
  itemsEnVista = 4;
  puedeIrIzquierda = false;
  puedeIrDerecha = true;
  puntos: number[] = [];
  puntoIndiceActual = 0;

  // Set para rastrear imágenes cargadas (simplificado)
  imagenCargada = new Set<number>();
  
  // Observador de intersección para lazy loading
  observadorIntersection!: IntersectionObserver;

  ngOnInit(): void {
    // Actualiza los puntos indicadores según la cantidad de productos
    this.actualizarPuntosIndicadores();
    
    // Para desarrollo: cargar todas las imágenes inmediatamente
    // Comentar esta línea si quieres usar lazy loading
    this.productos.forEach(producto => {
      this.imagenCargada.add(producto.id);
    });
  }

  ngAfterViewInit(): void {
    // Actualiza los botones de navegación según la posición actual
    this.actualizarBotonesNavegacion();
    
    // Configurar lazy loading solo si no están todas las imágenes cargadas
    if (this.imagenCargada.size < this.productos.length) {
      this.configurarLazyLoading();
    }
  }

  ngOnDestroy(): void {
    // Elimina el observador de intersección al destruir el componente
    if (this.observadorIntersection) {
      this.observadorIntersection.disconnect();
    }
  }

  /**
   * Configura el lazy loading de imágenes
   */
  private configurarLazyLoading(): void {
    setTimeout(() => {
      this.colocarObservadorIntersection();
      this.observarImagenesCargadas();
    }, 100);
  }

  /**
   * Configura el observador de intersección para detectar cuando las imágenes entran en vista
   */
  private colocarObservadorIntersection(): void {
    const options = {
      root: this.contenedorProductos?.nativeElement || null,
      rootMargin: '50px',
      threshold: 0.1
    };

    this.observadorIntersection = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          const imagen = entrada.target as HTMLImageElement;
          const productoId = parseInt(imagen.getAttribute('data-product-id') || '0');
          
          if (productoId && !this.imagenCargada.has(productoId)) {
            // Cargar imagen inmediatamente cuando entra en vista
            this.imagenCargada.add(productoId);
            // Dejar de observar esta imagen
            this.observadorIntersection.unobserve(imagen);
          }
        }
      });
    }, options);
  }

  /**
   * Observa las imágenes dentro del contenedor de productos
   */
  private observarImagenesCargadas(): void {
    if (this.itemsProductos?.nativeElement) {
      const imagenes = this.itemsProductos.nativeElement.querySelectorAll('.ImagenProducto');
      imagenes.forEach((img: HTMLImageElement) => {
        const productoId = parseInt(img.getAttribute('data-product-id') || '0');
        if (productoId && !this.imagenCargada.has(productoId)) {
          this.observadorIntersection.observe(img);
        }
      });
    }
  }

  /**
   * Optimiza la función del ngFor para evitar la creación de elementos innecesarios
   */
  rastrearPorProducto(index: number, producto: Producto): number {
    return producto.id;
  }

  /**
   * Obtiene la URL de la imagen o su placeholder si no está cargada
   */
  consigueImagenFuente(producto: Producto): string {
    return this.estaCargada(producto.id) 
      ? producto.imagen 
      : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcmdhbmRvLi4uPC90ZXh0Pjwvc3ZnPg==';
  }

  /**
   * Verifica si la imagen del producto está cargada
   */
  estaCargada(productoId: number): boolean {
    return this.imagenCargada.has(productoId);
  }

  /**
   * Se ejecuta cuando la imagen se carga exitosamente
   */
  imagenCargadaExitosa(event: Event, productoId: number): void {
    const imagen = event.target as HTMLImageElement;
    imagen.style.opacity = '1';
    
    // Asegurar que el producto esté marcado como cargado
    if (!this.imagenCargada.has(productoId)) {
      this.imagenCargada.add(productoId);
    }
  }

  /**
   * Se ejecuta cuando hay un error al cargar la imagen
   */
  imagenError(event: Event): void {
    const imagen = event.target as HTMLImageElement;
    imagen.src = 'https://media.istockphoto.com/id/1147544807/es/vector/no-imagen-en-miniatura-gr%C3%A1fico-vectorial.jpg?s=612x612&w=0&k=20&c=Bb7KlSXJXh3oSDlyFjIaCiB9llfXsgS7mHFZs6qUgVk=';
    imagen.style.opacity = '1';
  }

  /**
   * Navegar a la izquierda en la lista de productos
   */
  moverIzquierda(): void {
    if (this.puedeIrIzquierda) {
      this.indiceActual = Math.max(0, this.indiceActual - this.itemsEnVista);
      this.actualizarYTransformar();
      this.actualizarBotonesNavegacion();
      this.actualizarPuntoActual();
    }
  }

  /**
   * Navegar a la derecha en la lista de productos
   */
  moverDerecha(): void {
    if (this.puedeIrDerecha) {
      this.indiceActual = Math.min(
        this.productos.length - this.itemsEnVista, 
        this.indiceActual + this.itemsEnVista
      );
      this.actualizarYTransformar();
      this.actualizarBotonesNavegacion();
      this.actualizarPuntoActual();
    }
  }

  /**
   * Navega a la sección específica
   */
  irAlPunto(puntoIndice: number): void {
    this.indiceActual = puntoIndice * this.itemsEnVista;
    this.actualizarYTransformar();
    this.actualizarBotonesNavegacion();
    this.actualizarPuntoActual();
  }

  /**
   * Actualiza la transformación del CSS para mostrar los productos visibles
   */
  private actualizarYTransformar(): void {
    if (this.itemsProductos?.nativeElement) {
      const anchoProducto = 310; // 280px + 30px gap
      const cambioX = -(this.indiceActual * anchoProducto);
      this.itemsProductos.nativeElement.style.transform = `translateX(${cambioX}px)`;
    }
  }

  /**
   * Actualiza los botones de navegación según la posición actual
   */
  private actualizarBotonesNavegacion(): void {
    this.puedeIrIzquierda = this.indiceActual > 0;
    this.puedeIrDerecha = this.indiceActual < this.productos.length - this.itemsEnVista;
  }

  /**
   * Actualiza los puntos indicadores según la cantidad de productos
   */
  private actualizarPuntosIndicadores(): void {
    const puntosTotales = Math.ceil(this.productos.length / this.itemsEnVista);
    this.puntos = Array.from({ length: puntosTotales }, (_, i) => i);
  }

  /**
   * Actualiza el índice del punto actual según la posición de los productos
   */
  private actualizarPuntoActual(): void {
    this.puntoIndiceActual = Math.floor(this.indiceActual / this.itemsEnVista);
  }

  
}
