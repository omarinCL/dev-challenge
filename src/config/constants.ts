
// Definimos el tipo para los tamaños
export type ProductSize = 'S' | 'M' | 'L' | 'XL';

// Tamaños de productos ordenados de menor a mayor
export const PRODUCT_SIZES: ProductSize[] = ['S', 'M', 'L', 'XL'];

// Mensajes de error
export const ERROR_MESSAGES = {
    PRODUCT_NOT_FOUND: 'El producto no existe',
    NO_SCHEDULES_FOUND: 'No hay agendas disponibles para el producto',
    INVALID_COMMUNE: 'La comuna especificada no es válida',
    MAX_PRODUCTS_EXCEEDED: 'No se pueden consultar más de 10 productos',
    INVALID_REQUEST: 'La solicitud no es válida'
} as const;

// Configuración de la API
export const API_CONFIG = {
    MAX_PRODUCTS: 10,
    PORT: process.env.PORT || 3000,
    BASE_PATH: '/api'
} as const;