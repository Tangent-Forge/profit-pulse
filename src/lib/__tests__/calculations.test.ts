import {
  calculateBasicQPV,
  getInterpretation,
  getInterpretationText,
  getCategoryDisplayName,
} from '../calculations';

describe('calculateBasicQPV', () => {
  it('should calculate QPV score with correct weights', () => {
    const result = calculateBasicQPV({
      quickness: 10,
      profitability: 10,
      validationEase: 10,
    });

    expect(result.score).toBe(10);
    expect(result.interpretation).toBe('exceptional');
  });

  it('should apply correct weight formula (Q×40% + P×30% + V×30%)', () => {
    const result = calculateBasicQPV({
      quickness: 10, // 10 × 0.4 = 4
      profitability: 5, // 5 × 0.3 = 1.5
      validationEase: 5, // 5 × 0.3 = 1.5
    });

    expect(result.score).toBe(7); // 4 + 1.5 + 1.5 = 7
  });

  it('should return failure teaser', () => {
    const result = calculateBasicQPV({
      quickness: 5,
      profitability: 5,
      validationEase: 5,
    });

    expect(result.failureTeaser).toContain('fail');
  });
});

describe('getInterpretation', () => {
  it('should return correct interpretation for each score range', () => {
    expect(getInterpretation(9)).toBe('exceptional');
    expect(getInterpretation(8)).toBe('exceptional');
    expect(getInterpretation(7)).toBe('strong');
    expect(getInterpretation(6)).toBe('strong');
    expect(getInterpretation(5)).toBe('moderate');
    expect(getInterpretation(4)).toBe('moderate');
    expect(getInterpretation(3)).toBe('weak');
    expect(getInterpretation(2)).toBe('weak');
  });
});

describe('getInterpretationText', () => {
  it('should return correct text for each interpretation', () => {
    expect(getInterpretationText('exceptional')).toContain('launch this now');
    expect(getInterpretationText('strong')).toContain('prioritize');
    expect(getInterpretationText('moderate')).toContain('validate');
    expect(getInterpretationText('weak')).toContain('reconsider');
  });
});

describe('getCategoryDisplayName', () => {
  it('should return proper display names for categories', () => {
    expect(getCategoryDisplayName('ai-wrapper')).toBe('AI Wrapper/Tool');
    expect(getCategoryDisplayName('saas-tool')).toBe('SaaS Tool');
    expect(getCategoryDisplayName('notion-template')).toBe('Notion Template');
  });
});
