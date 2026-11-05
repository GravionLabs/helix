# Loop kinds in detail

Adapted from mattpocock/skills `skills/engineering/diagnosing-bugs/SKILL.md` @ 49dd158d1076134a641b33efb035946536778336 (MIT).

- **Failing test**: pick the lowest seam that still reaches the bug (unit, integration, e2e). Run command: see the `<lang>-test` skill from `detect-techstack`.
- **HTTP script**: start the dev server, call the endpoint, assert status and body. Read credentials from env vars.
- **CLI + fixture**: store input and expected output next to the test; diff stdout.
- **Headless browser**: drive the UI, assert on DOM, console errors or network calls.
- **Replay**: save the real request, payload or event log to disk (redacted) and replay it through the code path in isolation.
- **Throwaway harness**: smallest subset of the system with mocked dependencies; delete it in Phase 6 or move it to a marked debug location.
- **Property / fuzz**: run ~1000 random inputs, keep the failing one as the repro.
- **Bisection**: automate "boot at state X, check", then `git bisect run`.
- **Differential**: same input through two versions or configs, diff the outputs.
- **Human in the loop**: a script that prompts the human for each manual step and captures the answer so the loop stays structured.

## Tightening

- Faster: cache setup, skip unrelated init, narrow scope.
- Sharper: assert the specific symptom.
- More deterministic: pin time, seed RNG, isolate filesystem, freeze network.

## Non-deterministic bugs

Aim for a higher reproduction rate, not a clean repro: loop the trigger 100x, parallelise, add stress, narrow timing windows, inject sleeps. 50% is debuggable, 1% is not.

## Mutation check

If you force the red by mutating code or a fixture, `diff` against a pristine copy to prove the mutation landed before trusting the failure.
