# Aegis

A forensic workspace for investigating completed agent actions. Aegis compares a declared intent with an observed receipt, highlights literal field differences, and optionally anchors the local record's SHA-256 hash in the deployed Aegis contract. Unlike Runseal's pre-execution commitment, Aegis is post-action investigation. It does not claim that an anchored record is true, complete, or attributable to the named agent.

Aegis is deliberately a per-action investigation surface, not a generic agent activity/reputation dashboard (BotTrace) or Cessio's broader service/workflow loop.

## Verified testnet contract

See [BOTCHAIN_TESTNET.md](BOTCHAIN_TESTNET.md) for the recorded deployment transaction and source verification. The app defaults to that documented AegisAnchor address on BOT Chain Testnet (chain ID 968, RPC `https://rpc.bohr.life`, native token BOT, explorer `https://scan.bohr.life`). Contract address and ABI are taken from this repository's handoff and source; no sibling project addresses are used.

The deployed contract exposes `anchor(bytes32)`, `anchoredAt(bytes32)`, `operator()`, and `ActionAnchored`. It accepts any caller, rejects zero and duplicate hashes, and stores only a timestamp plus an event. `operator` is informational; it is not an access-control gate. Public reads need no wallet. Anchoring requires a user-triggered wallet connection, BOT Chain Testnet, ABI simulation, and explicit wallet confirmation.

## Run locally / Railway

```sh
npm ci
npm run typecheck
npm test
npm run build
npm start
```

The service binds `0.0.0.0:$PORT` (defaults to 4314 locally), serves `dist/`, resolves extensionless routes to the app shell, and exposes `/healthz` with app/revision metadata. Railway uses `railway.json`; set the optional public build-time values in `.env.example` only when using an approved endpoint/address. No server-side secret or private key is needed. `VITE_*` values are bundled into the public frontend and must never contain secrets.

## Evidence boundaries

- Example rows are illustrative UI fixtures, clearly labeled and prevented from being anchored.
- User records are local to this browser and partitioned by chain, contract and connected account (or public/unconnected scope); use Export to retain a JSON copy. Clearing browser storage loses them.
- The SHA-256 chain and field comparison can reveal edits or mismatches within the supplied record; they do not prove identity, execution, external data quality, or truth.
- The chain stores a commitment/timestamp, not the underlying intent/receipt. No oracle, external execution verifier, agent identity proof, storage backend or independent witness is integrated.
- The only external data source is the configured BOT Chain JSON-RPC for chain ID, latest block, bytecode and contract reads. Network availability is not guaranteed.

## Testnet proof checklist

- [x] Deployment transaction and address documented in `BOTCHAIN_TESTNET.md`.
- [x] RPC read-back confirms chain 968 and non-empty bytecode at the deployed address (recheck live before use).
- [ ] User-created non-example record passes local hash/chain integrity checks.
- [ ] Wallet simulation succeeds on testnet and a human confirms one anchor write.
- [ ] `anchoredAt(recordHash)` returns the contract timestamp after confirmation.
- [ ] `ActionAnchored` transaction is inspected at the verified explorer link; do not infer the underlying action's truth from this event.
