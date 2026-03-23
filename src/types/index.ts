export type EstadoPrenda = 'en_armario' | 'en_lavanderia' | 'perdido';

export interface Prenda {
  id: string;
  tipo: string;
  color: string;
  detalle: string;
  estado: EstadoPrenda;
  fechaEnvio?: number;
  esMultiple?: boolean;  // Can send multiple units (bags) at once
  cantidadEnviada?: number; // Stores how many were sent
}
