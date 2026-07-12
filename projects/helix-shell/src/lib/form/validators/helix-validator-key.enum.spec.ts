import { HelixValidatorKey } from './helix-validator-key.enum';

describe('HelixValidatorKey', () => {
  it('should have exactly 12 keys', () => {
    expect(Object.keys(HelixValidatorKey).length).toBe(12);
  });

  it('should have the expected enum values', () => {
    expect(HelixValidatorKey.Required).toBe('Required');
    expect(HelixValidatorKey.Email).toBe('Email');
    expect(HelixValidatorKey.Number).toBe('Number');
    expect(HelixValidatorKey.Integer).toBe('Integer');
    expect(HelixValidatorKey.Min).toBe('Min');
    expect(HelixValidatorKey.Max).toBe('Max');
    expect(HelixValidatorKey.MinLength).toBe('MinLength');
    expect(HelixValidatorKey.MaxLength).toBe('MaxLength');
    expect(HelixValidatorKey.Pattern).toBe('Pattern');
    expect(HelixValidatorKey.Date).toBe('Date');
    expect(HelixValidatorKey.OneOf).toBe('OneOf');
    expect(HelixValidatorKey.AllOf).toBe('AllOf');
  });
});
