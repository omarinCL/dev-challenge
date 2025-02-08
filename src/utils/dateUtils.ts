

/**
 * Verifica si la hora actual está dentro del horario de corte para el día actual
 * @param cutTimes Array de horarios de corte para cada día de la semana (Lunes a Domingo)
 * @returns boolean indicando si está dentro del horario de corte
 */
export function isWithinCutTime(cutTimes: string[]): boolean {
    // Si no hay horarios de corte, siempre está dentro del horario
    if (!cutTimes.length) {
        return true;
    }

    const now = new Date();
    const currentDay = now.getDay();
    // Ajustamos para que 0 sea Lunes (cutTimes empieza en Lunes)
    const adjustedDay = currentDay === 0 ? 6 : currentDay - 1;
    
    const cutTime = cutTimes[adjustedDay];
    if (!cutTime) {
        return true;
    }

    const [hours, minutes] = cutTime.split(':').map(Number);
    const cutTimeDate = new Date();
    cutTimeDate.setHours(hours, minutes, 0, 0);

    return now <= cutTimeDate;
}

/**
 * Formatea una fecha a string en formato HH:mm
 * @param date Fecha a formatear
 * @returns string en formato HH:mm
 */
export function formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}