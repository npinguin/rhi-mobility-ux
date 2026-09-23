# v1.0.0-rc.36 — charger occupancy semantics fix

## Scope
- corrects the Mobility Overview `free` charger count;
- treats `free` as a physical occupancy statement rather than an idle/zero-power statement;
- requires canonical disconnected evidence before an idle/stopped charger can be counted free;
- treats a physically connected charger as in use even when charging power is zero;
- fails closed to N/A when occupancy cannot be proven;
- leaves `active` as the count of chargers that are actually charging;
- adds regression tests covering the occupancy state matrix.

## Runtime evidence
The reported M0.9.36 runtime publishes four charger assets. The previous UX could count idle/stopped assets as free without proving they were physically unoccupied. rc.36 consumes the existing canonical charger connection/physical relationship contract instead.

## Rollback
Rollback candidate: `v1.0.0-rc.35`.

## Qualification
Static/package/HACS validation must pass before publication. Target Home Assistant proof must confirm the Overview free count reflects physical occupancy and no longer treats an idle-but-occupied charger as free.
