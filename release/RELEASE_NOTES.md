# v1.0.0-rc.101 — User-requested Mobility UX HACS runtime TEST (24 October 2026)

**TEST candidate only, not STABLE.** Explicit five-package authorization: https://github.com/npinguin/rhi-foundation/issues/129#issuecomment-6385576869. Source themes 3/12 fully accepted, physical 0/12. Readback and installed HA evidence still required.

## New consumer functionality since immutable rc.100

- [Mobility UX #202](https://github.com/npinguin/rhi-mobility-ux/pull/202): native Energy-owned actual charging sessions in Mobility History and each vehicle detail with real EVSE kWh, physically proven vehicle ID, unknown currency, correct EN/NL/FR and backend revision refresh.
- [Mobility UX #203](https://github.com/npinguin/rhi-mobility-ux/pull/203): signed negative € grid credits from Energy QUALIFIED session cost; unknown remains unknown, never client-computed.
- Preserve source-of-truth ownership: physical command/readback only Mobility backend, financial session cost only Energy, UX observes exact native contracts.

Coordinated stack Foundation **F1.8.48**, Mobility **M0.10.54**, Energy **E0.15.141**, Mobility UX **v1.0.0-rc.101**, Energy UX **v4.3.36-rc.23**. Install Foundation → Mobility → Energy → both UX; validate real Wessels charger/dual Audi Q8, Molas/Huawei and independent Sonnen/SMA, restart, responsive EN/NL/FR, source loss/recovery and full stack rollback. HACS runtime plugin is immutable tag `dist/`, no separately attached GitHub release bundle. STABLE NO-GO.
