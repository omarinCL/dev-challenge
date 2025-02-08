import { isWithinCutTime, formatTime } from '../../src/utils/dateUtils';

describe('DateUtils', () => {
    describe('isWithinCutTime', () => {
        it('debe retornar true cuando no hay horarios de corte', () => {
            expect(isWithinCutTime([])).toBe(true);
        });

        it('debe validar correctamente el horario de corte', () => {
            const now = new Date();
            const futureHour = (now.getHours() + 1).toString().padStart(2, '0');
            const pastHour = (now.getHours() - 1).toString().padStart(2, '0');
            
            // Creamos arrays con horarios futuros y pasados para cada día
            const futureCutTimes = Array(7).fill(`${futureHour}:00`);
            const pastCutTimes = Array(7).fill(`${pastHour}:00`);

            expect(isWithinCutTime(futureCutTimes)).toBe(true);
            expect(isWithinCutTime(pastCutTimes)).toBe(false);
        });
    });

    describe('formatTime', () => {
        it('debe formatear la hora correctamente', () => {
            const testDate = new Date(2024, 0, 1, 14, 30); // 14:30
            expect(formatTime(testDate)).toBe('14:30');
        });

        it('debe añadir ceros a la izquierda cuando sea necesario', () => {
            const testDate = new Date(2024, 0, 1, 9, 5); // 09:05
            expect(formatTime(testDate)).toBe('09:05');
        });
    });
});