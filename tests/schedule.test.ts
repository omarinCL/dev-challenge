import scheduleService from '../src/services/scheduleService';

describe('Schedule Service', () => {
  describe('Product Validation', () => {
    it('should return available schedules for valid product in San Bernardo', async () => {
      const request = {
        products: ['2000378936145'],
        commune: 'San Bernardo'
      };

      const response = await scheduleService.getCoverage(request);

      expect(response.products).toHaveLength(1);
      expect(response.products[0].schedules).toBeDefined();
      expect(response.products[0].schedules).toHaveLength(2);
      
      const schedule1082 = response.products[0].schedules.find(s => s.id === 'AZSR-1082-DP');
      expect(schedule1082).toMatchObject({
        id: 'AZSR-1082-DP',
        courier: '1082',
        serviceType: 'S',
        deliveryMethod: 'DP'
      });
      expect(schedule1082?.cutTime).toContain('Schedule is available 24/7 - No time restrictions');

      const schedule1034 = response.products[0].schedules.find(s => s.id === 'AZSR-1034-DP');
      expect(schedule1034).toMatchObject({
        id: 'AZSR-1034-DP',
        courier: '1034',
        serviceType: 'EX',
        deliveryMethod: 'DP'
      });
      expect(schedule1034?.cutTime).toHaveLength(2); 
      expect(response.errors).toHaveLength(0);
    });

    it('should return schedules for valid product in Buin', async () => {
      const request = {
        products: ['2000378936145'],
        commune: 'Buin'
      };

      const response = await scheduleService.getCoverage(request);

      expect(response.products).toHaveLength(1);
      expect(response.products[0].schedules).toBeDefined();
      expect(response.products[0].schedules.length).toBeGreaterThan(0);
    });

    it('should handle multiple valid products', async () => {
      const request = {
        products: ['2000378936145', '2000378839040'],
        commune: 'San Bernardo'
      };

      const response = await scheduleService.getCoverage(request);

      expect(response.products).toHaveLength(2);
      expect(response.errors).toHaveLength(0);
    });

    it('should return error for non-existent product', async () => {
      const request = {
        products: ['nonexistent-product'],
        commune: 'San Bernardo'
      };

      const response = await scheduleService.getCoverage(request);

      expect(response.products).toHaveLength(0);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].error).toBe('Product does not exist');
    });

    it('should throw error when more than 10 products are requested', async () => {
      const request = {
        products: Array(11).fill('2000378936145'),
        commune: 'San Bernardo'
      };

      await expect(scheduleService.getCoverage(request)).rejects.toThrow('Maximum 10 products allowed per request');
    });
  });

  describe('Size Range Validation', () => {
    it('should return schedules for size L product', async () => {
      const request = {
        products: ['2000378724582'], 
        commune: 'San Bernardo'
      };

      const response = await scheduleService.getCoverage(request);

      expect(response.products).toHaveLength(1);
      const schedules = response.products[0].schedules;
      expect(schedules).toBeDefined();
      schedules.forEach(schedule => {
        expect(['AZSR-1082-DP']).toContain(schedule.id);
      });
    });
  });

  describe('Commune Validation', () => {
    it('should handle non-existent commune', async () => {
      const request = {
        products: ['2000378936145'],
        commune: 'NonExistentCommune'
      };

      const response = await scheduleService.getCoverage(request);

      expect(response.products).toHaveLength(0);
      expect(response.errors).toHaveLength(1);
      expect(response.errors[0].error).toBe('No available schedules for this product');
    });
  });

  describe('Schedule Properties', () => {
    it('should return correct schedule properties', async () => {
      const request = {
        products: ['2000378936145'],
        commune: 'San Bernardo'
      };

      const response = await scheduleService.getCoverage(request);
      const schedule = response.products[0].schedules[0];

      expect(schedule).toHaveProperty('id');
      expect(schedule).toHaveProperty('courier');
      expect(schedule).toHaveProperty('serviceType');
      expect(schedule).toHaveProperty('deliveryMethod');
      expect(schedule).toHaveProperty('cutTime');
      expect(Array.isArray(schedule.cutTime)).toBe(true);
    });
  });
});