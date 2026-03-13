export type EstadoPrenda = 'en_armario' | 'en_lavanderia';

export interface Prenda {
  id: string;
  tipo: string;
  color: string;
  detalle: string;
  estado: EstadoPrenda;
  fechaEnvio?: number;
}
