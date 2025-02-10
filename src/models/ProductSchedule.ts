export interface ProductSchedule {
    product: string;
    schedules: {
        id: string;
        courier: string;
        serviceType: string;
        deliveryMethod: string;
        cutTime: string[];
    }[];
}