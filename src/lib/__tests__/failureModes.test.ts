import { getFailureModeData } from '../failureModes';

describe('getFailureModeData', () => {
  it('should return failure data for valid categories', () => {
    const aiWrapperData = getFailureModeData('ai-wrapper');

    expect(aiWrapperData).toHaveProperty('category');
    expect(aiWrapperData).toHaveProperty('abandonmentRate');
    expect(aiWrapperData).toHaveProperty('sustainabilityRate');
    expect(aiWrapperData).toHaveProperty('commonFailures');
    expect(aiWrapperData.category).toBe('ai-wrapper');
  });

  it('should return correct abandonment rates for different categories', () => {
    const saas = getFailureModeData('saas-tool');
    const newsletter = getFailureModeData('newsletter');

    expect(typeof saas.abandonmentRate).toBe('number');
    expect(typeof newsletter.abandonmentRate).toBe('number');
    expect(saas.abandonmentRate).toBeGreaterThan(0);
    expect(saas.abandonmentRate).toBeLessThan(100);
  });

  it('should include common failures with mitigation strategies', () => {
    const data = getFailureModeData('micro-saas');

    expect(Array.isArray(data.commonFailures)).toBe(true);
    expect(data.commonFailures.length).toBeGreaterThan(0);

    data.commonFailures.forEach(failure => {
      expect(failure).toHaveProperty('name');
      expect(failure).toHaveProperty('percentage');
      expect(failure).toHaveProperty('mitigation');
      expect(typeof failure.percentage).toBe('number');
      expect(failure.percentage).toBeGreaterThan(0);
    });
  });

  it('should handle all valid category types', () => {
    const categories = [
      'ai-wrapper',
      'saas-tool',
      'micro-saas',
      'notion-template',
      'digital-product',
      'newsletter',
      'content-creator',
      'community',
      'marketplace',
      'info-product',
      'agency-service',
      'consulting',
      'productized-service',
      'ecommerce',
      'mobile-app',
      'chrome-extension',
      'other',
    ];

    categories.forEach(category => {
      const data = getFailureModeData(category as any);
      expect(data).toBeDefined();
      expect(data.category).toBe(category);
    });
  });

  it('should fall back to "other" for unknown categories', () => {
    const data = getFailureModeData('unknown-category' as any);
    expect(data.category).toBe('other');
  });
});
