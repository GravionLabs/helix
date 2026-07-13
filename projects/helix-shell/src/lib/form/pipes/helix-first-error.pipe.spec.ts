import { HelixFirstError } from './helix-first-error.pipe';

describe('HelixFirstError', () => {
  const pipe = new HelixFirstError();

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty string for empty object', () => {
    expect(pipe.transform({})).toBe('');
  });

  it('should return the message for a single error', () => {
    expect(pipe.transform({ Required: 'Field is required' })).toBe('Field is required');
  });

  it('should return the first error message when multiple errors exist', () => {
    expect(pipe.transform({ Email: 'Bad email', MaxLength: 'Too long' })).toBe('Bad email');
  });

  it('should return empty string for non-string error values', () => {
    expect(pipe.transform({ required: true })).toBe('');
  });
});
