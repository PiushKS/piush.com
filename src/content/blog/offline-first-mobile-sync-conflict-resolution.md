---
title: 'Building Rock-Solid Offline-First Mobile Apps: CRDTs, Replicache, and Last-Write-Wins'
description: 'Real-world strategies for field technicians and spotty network connectivity. How we implemented optimistic local mutations, delta syncing, and conflict-free replicated data types.'
pubDate: 'Jan 29 2026'
heroImage: '../../assets/images/hero-offline-first-sync.webp'
category: 'Mobile Architecture'
tags: ['mobile', 'offline-first', 'architecture', 'databases']
author: 'Piush KS'
---

Most mobile apps claim to work offline, but in practice, "offline support" usually means displaying a cached read-only list view and disabling every button with an amber banner saying *"No internet connection available."*

Last year, we built an enterprise mobile suite for field technicians auditing telecom infrastructure in remote valleys and subterranean utility vaults. In these environments, cell signal drops out for four to six hours at a time. Technicians must be able to create work orders, annotate circuit diagrams, edit equipment statuses, and reassign tasks without experiencing UI locks.

When they emerge from the underground vault into a 5G zone, the app must synchronize hundreds of queued mutations against concurrent edits made by dispatchers back at headquarters, with **zero data loss** and zero conflicting overwrites.

Here is the exact synchronization architecture we designed, comparing **Last-Write-Wins (LWW)** timestamps, **CRDTs (Conflict-Free Replicated Data Types)**, and local mutation journals.

---

### The Three Fundamental Offline Architectures

```
1. NAIVE TIMESTAMP / LAST-WRITE-WINS (LWW):
   Client A (offline): updates status='pending' at 14:00
   Client B (online):  updates note='Check cable' at 14:02
   Result: Client B's update completely stomps Client A's status change. (DATA LOSS!)

2. DELTA MUTATION JOURNAL (Optimistic UI):
   Local writes record an ordered queue of discrete intents:
   [Mutation 101: SetStatus('pending')] -> [Mutation 102: AppendNote('Done')]
   Sent sequentially with server rebase.

3. STATE-BASED CRDT (Conflict-Free Replicated Data Types):
   Data structures (maps, sets, registers) mathematically guaranteed to merge
   identically on any node regardless of arrival order.
```

---

### Why Last-Write-Wins Causes Silent Data Corruption

Many mobile backends slap a `updated_at` column on their database tables and implement sync like this:
```sql
UPDATE tasks SET title = $title, status = $status, updated_at = NOW() 
WHERE id = $id AND updated_at < $client_timestamp;
```

This is fundamentally flawed for two reasons:
1. **Clock Skew**: Cell tower clocks and smartphone device clocks can easily drift by 500ms to 3 seconds. A technician with a phone clock running 2 seconds slow will always have their edits silently rejected.
2. **Coarse-Grained Overwrites**: If Technician A edits the `notes` field while Dispatcher B changes the `assignedTo` field on the web dashboard, the latest record overwrite wipes out the other person's legitimate work.

---

### Our Production Architecture: Local Mutation Queue + Server Rebase

To achieve deterministic consistency without the complexity overhead of full text CRDTs (like Yjs or Automerge) for non-document data, we implemented an **Optimistic Mutation Journal**:

```
[ User Action: Tap 'Complete' ]
         │
         ▼
[ Write to Local SQLite ] ── (Instant UI update: 2ms)
         │
         ▼
[ Append to MutationQueue Table ]
{ id: "mut_482", op: "UPDATE_STATUS", entityId: "task_99", payload: { status: "complete" }, clientOrder: 42 }
         │
         ▼ (Network Reconnected)
[ Sync Engine Drains Queue in Batches of 50 ]
         │
         ▼
[ Server Validates, Commits in SQL Transaction, & Returns New Version Vector ]
```

#### The Client Mutation Schema
```sql
CREATE TABLE local_mutations (
  mutation_id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  sync_state TEXT NOT NULL DEFAULT 'PENDING' -- PENDING, IN_FLIGHT, COMMITTED
);
```

When a user taps an action, the UI executes the mutation immediately against local SQLite and writes a row to `local_mutations`. The UI updates in **2 milliseconds**.

When network connectivity resumes:
1. The client sends a batch of mutations tagged with the client's last acknowledged `server_version`.
2. The server processes each mutation transactionally.
3. If an entity was modified concurrently, the server executes a **field-level merge function**:
   - Scalar fields (e.g. `status`) resolve via deterministic business logic (e.g., `'COMPLETED'` always supersedes `'IN_PROGRESS'`).
   - Text fields (e.g. audit checklists) use multi-value merge sets.
4. The server returns the canonical server sequence and any remote changes since the client's last sync point.

---

### Synchronization Benchmarks Under Heavy Load

We simulated 1,000 queued offline operations created across an 8-hour shift, syncing over an intermittent 3G connection with 250ms round-trip latency:

| Metric | Full Table Re-Fetch | Delta Sync (Our Queue Engine) | Delta Improvement |
| :--- | :--- | :--- | :--- |
| **Payload Size (Compressed)** | 14.8 MB | **184 KB** | **-98.7%** |
| **Total Sync Time** | 24.8 s | **1.14 s** | **-95.4%** |
| **Client Memory Spike** | 92 MB | **14 MB** | **-84.8%** |
| **Merge Conflict Rate** | 4.8% (Data overwrites) | **0.0% (Resolved deterministically)** | **Zero Data Loss** |

---

### 3 Hard-Won Lessons from the Field

1. **Never sync raw binary blobs over the wire**: If a user attaches an offline inspection photo (5 MB JPEG), compress it locally to a 1024px WebP (180 KB), compute its SHA-256 hash, and upload it via a dedicated background upload queue. Never let file uploads block the JSON metadata sync queue.
2. **Idempotency keys are non-negotiable**: Every mutation MUST have a UUID generated on the client. If an HTTP POST succeeds on the server but the mobile connection drops before receiving the 200 OK response, the client will retry. Without idempotency keys, you will charge customers twice or duplicate records.
3. **Expose sync states explicitly in UI**: Users panic if they think their data vanished. Show micro-indicators:
   - Green check: `Synced with cloud`
   - Blue arrows: `Syncing 3 pending edits...`
   - Gray clock: `Saved locally (Offline)`
