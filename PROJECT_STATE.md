# Aegis handoff

- Product: post-action forensic comparison of declared intent vs observed receipt; not a reputation score and not Runseal's pre-execution commitment.
- Contract: `AegisAnchor`, address `0xdcADf2477fAC44860214b1f9cfA960Eb9cDC4f60` on BOT Chain Testnet 968; see `BOTCHAIN_TESTNET.md` for deployment tx/source verification.
- Contract semantics: anyone may anchor a nonzero unique bytes32; mapping stores timestamp; event records hash and caller. `operator` is not an authorization check.
- App storage: browser-local and scoped by chain/contract/account; example records are synthetic and never anchorable.
- Integration: public viem reads and user-confirmed wallet write. Anchor commitment proves only that a hash was recorded.
- Remaining: run install/typecheck/tests/build/browser QA, confirm live RPC, then human review of UI and one optional testnet wallet write. No deploy/push is part of this pass.
