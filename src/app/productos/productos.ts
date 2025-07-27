import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';

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
export class ProductosComponent implements OnInit,AfterViewInit, OnDestroy {
  
  // Referencias a los elementos del DOM para el contenedor y los items de productos
  @ViewChild('contenedorProductos') contenedorProductos!: ElementRef;
  @ViewChild('itemsProductos') itemsProductos!: ElementRef;

  // Lista de productos que se mostrarán en la aplicación
  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Envases de limpieza de plastico reciclado',
      precio: 20,
      descripcion: 'Envases reutilizables, hechos de plástico reciclado, ideales para productos de limpieza ecológicos.',
      imagen: 'https://www.ilser.net/wp-content/uploads/2024/12/productos-limpieza-ecologicos.jpg'
    },
    {
      id: 2,
      nombre: 'Envases de cartón',
      precio: 10,
      descripcion: 'Envases hechos de cartón biodegradable, perfectos para alimentos y productos sostenibles.',
      imagen: 'https://alimonhoreca.com/wp-content/uploads/2022/06/Productos_desechables_ecologicos_biodegradables_sostenible_alimon_horeca.jpg'
    },
    {
      id: 3,
      nombre: 'Cepillos y esponjas de bambú',
      precio: 30,
      descripcion: 'Productos de limpieza ecológicos, fabricados con bambú sostenible, ideales para el hogar.',
      imagen: 'https://verdeaurora.com/wp-content/uploads/2023/05/beneficios-productos-ecologicos-m.png'
    },
    {
      id: 4,
      nombre: 'Bolsas de tela reciclable',
      precio: 10,
      descripcion: 'Bolsa de tela ecológica, reutilizable y reciclable, perfecta para compras sostenibles.',
      imagen: 'https://imagenes.elpais.com/resizer/v2/EGHBH7I3OBWZYELMRCE3R467M4.jpg?auth=b38df221335d3e11a8d9bb4ec54fe3578cddafc467ddc61b611a56777ae86967&width=1960&height=1470&smart=true'
    },
    {
      id: 5,
      nombre: 'Cubiertos de madera biodegradable',
      precio: 10,
      descripcion: 'Cubiertos ecológicos de madera, biodegradables y compostables, ideales para eventos sostenibles y el día a día',
      imagen: 'https://www.greentecher.com/wp-content/uploads/2023/03/marco-productos-ecologicos-_1_.webp'
    },
    {
      id: 6,
      nombre: 'Equipo de oficina de cartón reciclado',
      precio: 15,
      descripcion: 'Equipo de oficina ecológico, fabricado con cartón reciclado, ideal para un entorno de trabajo amigable con el medio ambiente.',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzR6AtF9uhlwfSrn494BtPSVueqhv_vhYg9w&s'
    },
    {
      id: 7,
      nombre: 'Cebillo para el baño de bambú',
      precio: 40,
      descripcion: 'Cepillo con ebras y mango de bambú.',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd2PkHqEvCP8phS3pR1_FoUZ1qAXrYquxrrg&s'
    },
    {
      id: 8,
      nombre: 'Ganchos de ropa de materiales reciclados',
      precio: 25,
      descripcion: 'Ganchos ecológicos para colgar ropa, hechos de materiales reciclados',
      imagen: 'https://www.antevenio.com/wp-content/uploads/2021/02/gancho-eco.png'
    }
  ];

  // Variables de control de navegación
  indiceActual = 0;
  itemsEnVista = 4;
  puedeIrIzquierda = false;
  puedeIrDerecha = true;
  puntos: number[] = [];
  puntoIndiceActual = 0;

  RevisatamanoVentana(): void {
    // Verifica el tamaño de la ventana y ajusta itemsEnVista
    const anchoVentana = window.innerWidth;
    if (anchoVentana < 480) {
      this.itemsEnVista = 1; // Muestra un producto a la vez en pantallas pequeñas
    } else if (anchoVentana < 768) {
      this.itemsEnVista = 2; // Muestra dos productos a la vez en pantallas medianas
    } else if (anchoVentana < 1024) {
      this.itemsEnVista = 3; // Muestra tres productos a la vez en pantallas grandes
    } else {
      this.itemsEnVista = 4; // Muestra cuatro productos a la vez en pantallas extra grandes
    }
  }

  // Set para rastrear imágenes cargadas (simplificado)
  imagenCargada = new Set<number>();
  
  // Observador de intersección para lazy loading
  observadorIntersection!: IntersectionObserver;
 
    ngOnInit(): void {
    this.productos.forEach(producto => {// Recorre cada producto y añade su ID al conjunto de imágenes cargadas
      this.imagenCargada.add(producto.id);// Añade el ID del producto al conjunto de imágenes cargadas
    });
    
    
  }

  ngAfterViewInit(): void {
    // Actualiza los botones de navegación según la posición actual
    this.actualizarBotonesNavegacion();
    
    // Configurar lazy loading solo si no están todas las imágenes cargadas
    if (this.imagenCargada.size < this.productos.length) {
      // Configura el lazy loading de imágenes
      this.configurarLazyLoading();
    }

    // Aplicar la transformación inicial
    setTimeout(() => {
      // Asegura que los elementos estén renderizados antes de aplicar la transformación
      this.actualizarYTransformar();
    }, 0);
  }

  ngOnDestroy(): void {
    // Elimina el observador de intersección al destruir el componente
    if (this.observadorIntersection) {
      // Desconecta el observador para evitar fugas de memoria
      this.observadorIntersection.disconnect();
    }
  }



  /**
   * Configura el lazy loading de imágenes
   */
  private configurarLazyLoading(): void {
    // Espera un breve momento para asegurar que el DOM esté completamente cargado
    setTimeout(() => {
      // Coloca el observador de intersección para las imágenes
      this.colocarObservadorIntersection();
      // Observa las imágenes dentro del contenedor de productos
      this.observarImagenesCargadas();
      // Actualiza la transformación inicial de los productos
    }, 100);
  }

  /**
   * Configura el observador de intersección para detectar cuando las imágenes entran en vista
   */
  private colocarObservadorIntersection(): void {
    const options = {
      // Configuración del observador de intersección
      root: this.contenedorProductos?.nativeElement || null,
      rootMargin: '50px',
      threshold: 0.1
    };

    // Crea un nuevo observador de intersección
    this.observadorIntersection = new IntersectionObserver((entradas) => {
      // Itera sobre las entradas del observador
      entradas.forEach((entrada) => {
        // Si la entrada está intersectando, carga la imagen
        if (entrada.isIntersecting) {
          // Obtiene el elemento de imagen y su ID de producto
          const imagen = entrada.target as HTMLImageElement;
          // Asegura que el ID del producto sea un número válido
          const productoId = parseInt(imagen.getAttribute('data-product-id') || '0');
          // Si el ID del producto es válido y la imagen no ha sido cargada aún
          if (productoId && !this.imagenCargada.has(productoId)) {
            // Carga la imagen estableciendo su fuente
            this.imagenCargada.add(productoId);
            // Establece la fuente de la imagen
            this.observadorIntersection.unobserve(imagen);
          }
        }
      });
      // Observa nuevamente las imágenes cargadas
    }, options);
  }

  /**
   * Observa las imágenes dentro del contenedor de productos
   */
  private observarImagenesCargadas(): void {
    // Asegura que el contenedor de productos y sus elementos estén disponibles
    if (this.itemsProductos?.nativeElement) {
      // Selecciona todas las imágenes de productos dentro del contenedor
      const imagenes = this.itemsProductos.nativeElement.querySelectorAll('.ImagenProducto');
      // Itera sobre cada imagen y observa aquellas que no han sido cargadas
      imagenes.forEach((img: HTMLImageElement) => {
        // Obtiene el ID del producto desde el atributo data-product-id
        const productoId = parseInt(img.getAttribute('data-product-id') || '0');
        // Si el ID del producto es válido y la imagen no ha sido cargada aún
        if (productoId && !this.imagenCargada.has(productoId)) {
          // Establece la opacidad inicial de la imagen
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
    // Asegura que el evento es del tipo HTMLImageElement
    const imagen = event.target as HTMLImageElement;
    // Establece la opacidad de la imagen a 1 para mostrarla
    imagen.style.opacity = '1';
    // Añade el ID del producto al conjunto de imágenes cargadas
    if (!this.imagenCargada.has(productoId)) {
      // Solo añade el ID si aún no está cargado
      this.imagenCargada.add(productoId);
    }
  }

  /**
   * Se ejecuta cuando hay un error al cargar la imagen
   */
  imagenError(event: Event): void {
    // Asegura que el evento es del tipo HTMLImageElement
    const imagen = event.target as HTMLImageElement;
    // Establece una imagen de placeholder y opacidad para indicar el error
    imagen.src = 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg';
    imagen.style.opacity = '1';
  }

  /**
   * Navegar a la izquierda en la lista de productos
   */
  moverIzquierda(): void {
    // Asegura que el tamaño de la ventana se ha revisado antes de mover
    this.RevisatamanoVentana();
    // Verifica si se puede mover a la izquierda
    if (this.puedeIrIzquierda) {
      // Ajusta el índice actual para mover a la izquierda
      this.indiceActual = Math.max(0, this.indiceActual - this.itemsEnVista);
      //Actualiza la vista de productos y los botones de navegación
      this.actualizarYTransformar();
      this.actualizarBotonesNavegacion();
     // this.actualizarPuntoActual();
    }
  }

  /**
   * Navegar a la derecha en la lista de productos
   */
  moverDerecha(): void {
    // Asegura que el tamaño de la ventana se ha revisado antes de mover
    this.RevisatamanoVentana();
    // Verifica si se puede mover a la derecha
    if (this.puedeIrDerecha) {
      // Ajusta el índice actual para mover a la derecha
      this.indiceActual = Math.min(
        this.productos.length - this.itemsEnVista, 
        this.indiceActual + this.itemsEnVista
      );
      // Actualiza la vista de productos y los botones de navegación
      this.actualizarYTransformar();
      this.actualizarBotonesNavegacion();
      
    }
  }

  /**
   * Actualiza la transformación del CSS para mostrar los productos visibles
   */
  private actualizarYTransformar(): void {
    
    // Asegura que el contenedor de productos y sus elementos están disponibles
    if (this.itemsProductos?.nativeElement) {
      // Calcula el desplazamiento necesario para mostrar los productos
      const anchoProducto = 310; // 280px + 30px gap
      // Calcula el desplazamiento basado en el índice actual
      const cambioX = -(this.indiceActual * anchoProducto);
      // Aplica la transformación al contenedor de productos
      this.itemsProductos.nativeElement.style.transform = `translateX(${cambioX}px)`;
    }
  }

  /**
   * Actualiza los botones de navegación según la posición actual
   */
  private actualizarBotonesNavegacion(): void {
    this.RevisatamanoVentana();
    // Verifica si el índice actual permite navegar a la izquierda o derecha
    this.puedeIrIzquierda = this.indiceActual > 0;
    // Verifica si hay más productos a la derecha para navegar
    this.puedeIrDerecha = this.indiceActual < this.productos.length - this.itemsEnVista;
  }

}