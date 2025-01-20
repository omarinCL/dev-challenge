import { IProduct } from "../../interface/products.interface";
import { IScheduleRoutes } from "../../interface/schedule_routes.interface";
const { 
    validateCommuneAndStatus,
    getNotExistsProducts,
    getExistsProducts } = require('./getSchedule');

const mockProducts: IProduct[] = [
    {
        "id": "2000378936145",
        "name": "PLANNER PU ESTRELLAS",
        "parents": {
            "subline": "S528912",
            "line": "503657",
            "department": "D383"
        },
        "size": "S"
    },
    {
        "id": "2000378839040",
        "name": "BLUSA ML EATI BB2 NAC I20 NEGRO L",
        "parents": {
            "subline": "S530801",
            "line": "502383",
            "department": "D330"
        },
        "size": "S"
    },
    {
        "id": "2000378724582",
        "name": "VESTIR MQS NIGHT SAFIANO VER20 NG NEGRO 41",
        "parents": {
            "subline": "S503009",
            "line": "500935",
            "department": "D310"
        },
        "size": "L"
    }
]

const mockScheduleRoutes: IScheduleRoutes[] = [{
    "scheduleId": "AZSR-1080-DP",
    "commune": "San Bernardo",
    "active": false,
    "minSize": "S",
    "maxSize": "XL"
}, {
    "scheduleId": "AZSR-1080-DP",
    "commune": "Buin",
    "active": true,
    "minSize": "S",
    "maxSize": "XL"
}, {
    "scheduleId": "AZSR-1034-DP",
    "commune": "Buin",
    "active": true,
    "minSize": "S",
    "maxSize": "S"
}, {
    "scheduleId": "AZSR-1034-DP",
    "commune": "San Bernardo",
    "active": true,
    "minSize": "S",
    "maxSize": "S"
}, {
    "scheduleId": "AZSR-1082-DP",
    "commune": "Buin",
    "active": true,
    "minSize": "S",
    "maxSize": "L"
}, {
    "scheduleId": "AZSR-1082-DP",
    "commune": "San Bernardo",
    "active": true,
    "minSize": "S",
    "maxSize": "L"
}]

describe('getNotExistsProducts', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('devolera los ids que no se encuentren en la data de products', () => {

        const params = { products: ['9999999999999', '12345'] };
        const result = getNotExistsProducts(mockProducts, params.products);

        expect(result).toEqual(['9999999999999', '12345']);
    });

    it('devolver solo un id de los que le enviemos', () => {

        const params = { products: ['2000378936145', '12345'] };
        const result = getNotExistsProducts(mockProducts, params.products);

        expect(result).toEqual(['12345']);
    });
});


describe('getExistsProducts', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('debe devolver los productos que se encuentran en la base de datos', () => {

        const params = { products: ['2000378936145', '12345'] };
        const result = getExistsProducts(mockProducts, params.products);

        expect(result).toEqual([{
            "id": "2000378936145",
            "name": "PLANNER PU ESTRELLAS",
            "parents": {
                "subline": "S528912",
                "line": "503657",
                "department": "D383"
            },
            "size": "S"
        }]);
    });

    it('no debe devolver ningun producto', () => {
    
        const params = { products: ['1234', '12345'] };
        const result = getExistsProducts(mockProducts, params.products);

        expect(result).toEqual([]);
    });
});

describe('validateCommuneAndStatus', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('debe mostrar los registros con comuna valida y active == true', () => {

        const params = { commune: 'San Bernardo', active: true };
        const result = validateCommuneAndStatus(mockScheduleRoutes, params.commune, params.active);

        expect(result).toEqual([
            {
                "scheduleId": "AZSR-1034-DP",
                "commune": "San Bernardo",
                "active": true,
                "minSize": "S",
                "maxSize": "S"
            },
            {
                "scheduleId": "AZSR-1082-DP",
                "commune": "San Bernardo",
                "active": true,
                "minSize": "S",
                "maxSize": "L"
            },

        ]);
    });

    it('debe mostrar solamente registros comuna valida y con active == false', () => {

        const params = { commune: 'San Bernardo', active: false };
        const result = validateCommuneAndStatus(mockScheduleRoutes, params.commune, params.active);

        expect(result).toEqual([
            {
                "scheduleId": "AZSR-1080-DP",
                "commune": "San Bernardo",
                "active": false,
                "minSize": "S",
                "maxSize": "XL"
            }
        ]);
    });

    it('No debe mostrar nada ya que la comuna no es valida', () => {

        const params = { commune: 'Conchalí', active: true };
        const result = validateCommuneAndStatus(mockScheduleRoutes, params.commune, params.active);

        expect(result).toEqual([]);
    });
});