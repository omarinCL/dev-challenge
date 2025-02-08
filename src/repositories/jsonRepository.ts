
import fs from 'fs';
import path from 'path';
import { Product } from '../interfaces/Product';
import { Schedule } from '../interfaces/Schedule';
import { ScheduleRoute } from '../interfaces/ScheduleRoute';

export class JsonRepository {
    private readonly resourcePath: string;

    constructor() {
        // Establecemos la ruta a los recursos
        this.resourcePath = path.join(process.cwd(), 'resources');
        console.log('Resource path:', this.resourcePath);
    }

    /**
     * Lee y retorna todos los productos del archivo JSON
     */
    async getProducts(): Promise<Product[]> {
        const filePath = path.join(this.resourcePath, 'products.json');
        console.log('Reading products from:', filePath);
        const data = await this.readJsonFile(filePath);
        return data as Product[];
    }

    /**
     * Lee y retorna todas las agendas del archivo JSON
     */
    async getSchedules(): Promise<Schedule[]> {
        const filePath = path.join(this.resourcePath, 'schedules.json');
        console.log('Reading schedules from:', filePath);
        const data = await this.readJsonFile(filePath);
        return data as Schedule[];
    }

    /**
     * Lee y retorna todas las rutas de agenda del archivo JSON
     */
    async getScheduleRoutes(): Promise<ScheduleRoute[]> {
        const filePath = path.join(this.resourcePath, 'schedule-routes.json');
        console.log('Reading schedule routes from:', filePath);
        const data = await this.readJsonFile(filePath);
        return data as ScheduleRoute[];
    }

    /**
     * Método privado para leer archivos JSON
     */
    private async readJsonFile(filePath: string): Promise<unknown> {
        try {
            console.log('Attempting to read file:', filePath);
            const fileContent = await fs.promises.readFile(filePath, 'utf-8');
            return JSON.parse(fileContent);
        } catch (error) {
            console.error('Error reading file:', filePath);
            console.error('Error details:', error);
            if (error instanceof Error) {
                throw new Error(`Error al leer el archivo JSON: ${error.message}`);
            }
            throw error;
        }
    }
}