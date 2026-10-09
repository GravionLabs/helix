import { ValidatorKey } from './validator-key.enum';

describe('ValidatorKey', () => {
  it('should have exactly 12 keys', () => {
    expect(Object.keys(ValidatorKey).length).toBe(12);
  });

  it('should have the expected enum values', () => {
    expect(ValidatorKey.Required).toBe('Required');
    expect(ValidatorKey.Email).toBe('Email');
    expect(ValidatorKey.Number).toBe('Number');
    expect(ValidatorKey.Integer).toBe('Integer');
    expect(ValidatorKey.Min).toBe('Min');
    expect(ValidatorKey.Max).toBe('Max');
    expect(ValidatorKey.MinLength).toBe('MinLength');
    expect(ValidatorKey.MaxLength).toBe('MaxLength');
    expect(ValidatorKey.Pattern).toBe('Pattern');
    expect(ValidatorKey.Date).toBe('Date');
    expect(ValidatorKey.OneOf).toBe('OneOf');
    expect(ValidatorKey.AllOf).toBe('AllOf');
  });
});
