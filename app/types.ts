export interface Tienda {
  id: number;
  Nombre: string;
  Descripcion: string;
  Ubicacion: string;
  HorarioApertura: string; // ISO 8601 format
  HorarioCierre: string;   // ISO 8601 format
  Categoria: string;
  TiempoEntregaPromedio: number; // en horas
  costoEnvio: string; // podría cambiar a number si se prefiere precisión decimal
  rating: string;     // lo mismo aquí si planeas hacer cálculos, puede convertirse a number
  fotos_tienda: string[];
}

export interface Producto {
  id: number;
  tiendaId: number;
  nombre: string;
  descripcion: string;
  precio: string;
  precioPromocion: string;
  categoria: string;
  ingrediente: string;
  disponibilidad: boolean;
  tiempoPreparacion: number;
  fotosProducto: string[];
  destacado: boolean;
}
export type CarritoItem = {
    tiendaId:string;
    productoId: string;
    cantidad: number;
};