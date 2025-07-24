export interface Tienda {
  id: string;
  userId: number;
  nombre: string;
  descripcion: string;
  ubicacion: string;
  horarioApertura: string; // Podrías usar Date si transformas el string
  horarioCierre: string;   // Igual que arriba
  tiempoEntregaPromedio: number;
  costoEnvio: string;  // Si siempre es un número, podrías cambiarlo a `number`
  rating: string;      // También podría ser `number` si es decimal
  fotosTienda: string[]; // Array de URLs
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock_actual: number;
  stock_minimo: number;
  imagen_url: string;
  activo: boolean;
  tiendaId: string;
  categoriaId: string;
}
export type CarritoItem = {
    tiendaId:string;
    productoId: string;
    cantidad: number;
};