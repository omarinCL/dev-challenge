import { IProduct } from "../../interface/products.interface";
import { IScheduleRoutes } from "../../interface/schedule_routes.interface";
import { ISchedules } from "../../interface/schedules.interface";

const products_db: IProduct[] = require('../database/products.json');
const schedule_routes_db: IScheduleRoutes[] = require('../database/schedule-routes.json');
const schedules_db: ISchedules[] = require('../database/schedules.json');

interface Params {
    products: string[];
    commune: string;
}

const getCurrentDayAndTime = () => {
    const now = new Date();
    const day = now.getDay();
    const time = now.getHours() * 60 + now.getMinutes();
    return { day, time };
};

const getNotExistsProducts = (products: IProduct[], productsFind: string[]): string[] => {
    try {
        const filteredProducts = products.filter((product) => productsFind.includes(product.id));
        const nonExistingIds = productsFind.filter(id => !filteredProducts.some(product => product.id === id));
        return nonExistingIds
    } catch (error) {
        console.log(error);
        return []
    }   
}
const getExistsProducts = (products: IProduct[], productsFind: string[]): IProduct[] => {
    try {
        const filteredProducts = products.filter((product) => productsFind.includes(product.id));
        return filteredProducts;
    } catch (error) {
        console.log(error);
        return []
    }   
}

const validateCommuneAndStatus = (schedules_routes:IScheduleRoutes[], commune: string, active: boolean): IScheduleRoutes[] => {
    try {   
        const filteredScheduleRoutes = schedules_routes
            .filter((sr) => sr.commune === commune)
            .filter((sr) => sr.active === active);

        return filteredScheduleRoutes;
    } catch (error) {
        console.log(error);
        return []
    }
}

const getSchedule = (params: Params) => {
    try {
        const { products, commune } = params;
        const { day, time } = getCurrentDayAndTime();

        const filteredProducts = getExistsProducts(products_db, products);
        const nonExistingIds = getNotExistsProducts(products_db, products);

        const productsDoesNotExist = nonExistingIds.map(p => ({
            product: p,
            error: "El producto no existe"
        }));

        const sizes: string[] = ["S", "M", "L", "XL"];
        const getSizeIndex = (size: string): number => sizes.indexOf(size);

        const productFilter = schedule_routes_db
            .filter((sr) => sr.commune === commune)
            .filter((sr) => sr.active)
            .map((sr) => {
                const minSizeIndex = getSizeIndex(sr.minSize);
                const maxSizeIndex = getSizeIndex(sr.maxSize);

                return filteredProducts
                    .filter((p) => {
                        const productSizeIndex = getSizeIndex(p.size);
                        return productSizeIndex >= minSizeIndex && productSizeIndex <= maxSizeIndex;
                    })
                    .map((p) => {
                        const schedulesForProduct = schedules_db.filter((sche) => sche.id === sr.scheduleId);

                        if (schedulesForProduct.length === 0) {
                            return {
                                product: p.id,
                                error: "No hay agendas disponibles para este producto"
                            };
                        }

                        const validSchedules = schedulesForProduct.filter((schedule) => {
                            if (!schedule.cutTime || schedule.cutTime.length === 0) {
                                return true;
                            }

                            const cutTimeStr = schedule.cutTime[day];
                            if (!cutTimeStr) return true;

                            const [cutHour, cutMinute] = cutTimeStr.split(":").map(Number);
                            const cutTimeInMinutes = cutHour * 60 + cutMinute;
                            const isAfterCutTime = time > cutTimeInMinutes;

                            return !isAfterCutTime;
                        });

                        if (validSchedules.length === 0) {
                            return {
                                product: p.id,
                                error: "No hay agendas disponibles para este producto después de la hora de corte"
                            };
                        }

                        return {
                            product: p.id,
                            schedules: validSchedules
                        };
                    });
            })
            .flat();

        const response = {
            products: productFilter.length ? productFilter : null,
            errors: productsDoesNotExist.length ? productsDoesNotExist : null
        };

        return response;
    } catch (error) {
        console.log(error);
        return {
            products: [],
            errors: [{ product: "", errors: "Error al procesar la solicitud" }]
        };
    }
};


module.exports = {
    getSchedule,
    getNotExistsProducts,
    getExistsProducts,
    validateCommuneAndStatus
}