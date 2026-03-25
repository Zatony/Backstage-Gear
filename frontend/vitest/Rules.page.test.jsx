import { describe, expect, it } from 'vitest';
import RulesPage from '../src/page_rules/rules.jsx';

describe('page_rules/rules.jsx', () => {
  it('exports a page component', () => {
    expect(RulesPage).toBeDefined();
  });
});
