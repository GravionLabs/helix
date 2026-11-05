# Good tests

Adapted from `skills/engineering/tdd` in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License, Matt Pocock), commit `49dd158d1076134a641b33efb035946536778336`. Reworded for this hub.

## Rules

- **Behavior, not internals.** A test calls the public interface (function, endpoint, command, component) and asserts what a caller can observe. It survives a refactor that keeps the behavior. A test that breaks when a private helper is renamed, or that asserts call order or internal state, is coupled to internals.
- **No tautological assertions.** The expected value comes from a literal, a worked example or the spec, never from re-running the logic under test (`expect(f(x)).toBe(f(x))`, or recomputing with the same formula). If the test would still pass with the implementation broken, it proves nothing.
- **Vertical slices.** Write one failing test, then the minimal code to pass it, then the next test. Never write all tests first and then all code: bulk tests lock in imagined behavior and guess at the interface.
- **Refactor in review, not in the loop.** The red → green loop only makes the test pass. Restructuring happens afterwards, with the tests green, and is judged in review.

## Checks before committing

- Each new test names a behavior and would fail if that behavior broke.
- Each expected value can be traced to a literal, an example or the spec.
- No test reaches into private members or asserts on how the result is produced.
