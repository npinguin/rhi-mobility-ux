# Mobility UX release governance — two-stage workflow

The exact policy authority is [Foundation #129](https://github.com/npinguin/rhi-foundation/issues/129) and `governance/TWO_STAGE_RELEASE_GOVERNANCE.md` in rhi-foundation.

**HACS TEST:** The user explicitly requests a five-package candidate. A one-time machine `test_request` bound to the current package version, whole coordinated matrix and traceable request authorizes only a `workflow_run` after successful source `Validate` on exact `main`. This does not need runtime qualification or all scope items VERIFIED. No auto releases on regular merges and no retagging.

**Official STABLE:** never from a TEST request. Requires a separately logged user approval for the exact stable tag **and** existing runtime qualification PASS, original rollback/provenance and distribution checks. Default status is NOT_APPROVED. Existing public UX candidate semantics are preserved; UX releases are not automatically backend STABLE.
