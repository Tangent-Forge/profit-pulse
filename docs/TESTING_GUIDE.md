# Testing Guide

Profit Pulse has comprehensive test coverage including unit tests, integration tests, and end-to-end tests.

## Test Stack

- **Unit/Integration Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Accessibility Testing**: @axe-core/playwright

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run in watch mode (runs tests on file changes)
npm run test:watch

# Run with coverage report
npm run test:coverage
```

### E2E Tests

```bash
# Install Playwright browsers (first time only)
npm run playwright:install

# Run E2E tests headless
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (see the browser)
npm run test:e2e:headed
```

## Test Structure

```
profit-pulse/
├── src/lib/__tests__/          # Unit tests for business logic
│   ├── calculations.test.ts    # QPV calculation tests
│   ├── validations.test.ts     # Input validation tests
│   ├── failureModes.test.ts    # Failure mode data tests
│   └── stripe.test.ts          # Stripe helper tests
│
├── e2e/                         # End-to-end tests
│   ├── home.spec.ts            # Homepage tests
│   └── auth.spec.ts            # Authentication flow tests
│
├── jest.config.ts               # Jest configuration
├── jest.setup.ts                # Jest test setup
└── playwright.config.ts         # Playwright configuration
```

## Writing Tests

### Unit Test Example

```typescript
import { calculateBasicQPV } from '../calculations';

describe('calculateBasicQPV', () => {
  it('should calculate correct QPV score', () => {
    const result = calculateBasicQPV({
      quickness: 10,
      profitability: 10,
      validationEase: 10,
    });

    expect(result.score).toBe(10);
    expect(result.interpretation).toBe('exceptional');
  });
});
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('should load homepage', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Profit Pulse/i })).toBeVisible();
});
```

## Test Coverage

Current test coverage:

- **Unit Tests**: 35 passing tests
- **E2E Tests**: Configured and ready

Coverage goals:
- Functions: 80%+
- Statements: 80%+
- Branches: 70%+
- Lines: 80%+

## Continuous Integration

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Pre-deployment checks

## Accessibility Testing

All E2E tests include automated accessibility checks using axe-core:

```typescript
import AxeBuilder from '@axe-core/playwright';

test('should not have accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

## Best Practices

1. **Test File Naming**
   - Unit tests: `*.test.ts`
   - E2E tests: `*.spec.ts`

2. **Test Organization**
   - Group related tests using `describe()`
   - Use clear, descriptive test names
   - Follow AAA pattern (Arrange, Act, Assert)

3. **Mocking**
   - Mock external dependencies (Stripe, APIs)
   - Use real implementations for business logic
   - Avoid over-mocking

4. **Coverage**
   - Test critical paths first
   - Don't aim for 100% coverage
   - Focus on business logic and user flows

5. **Performance**
   - Keep tests fast (< 1s per test)
   - Use parallel execution
   - Clean up after tests

## Debugging Tests

### Jest

```bash
# Run specific test file
npm test -- calculations.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="QPV"

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Playwright

```bash
# Run with UI mode for debugging
npm run test:e2e:ui

# Run in headed mode
npm run test:e2e:headed

# Debug specific test
npx playwright test home.spec.ts --debug
```

## Troubleshooting

### Common Issues

**Jest: Module not found**
- Clear Jest cache: `npx jest --clearCache`
- Check moduleNameMapper in jest.config.ts

**Playwright: Browser not found**
- Run: `npm run playwright:install`

**Tests timing out**
- Increase timeout in configuration
- Check for async operations not being awaited

**Flaky tests**
- Add proper waits in E2E tests
- Use `waitFor` utilities
- Avoid hard-coded delays

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Axe Accessibility](https://www.deque.com/axe/)
