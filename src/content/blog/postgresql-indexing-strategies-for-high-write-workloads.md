---
title: 'PostgreSQL Indexing Under Fire: B-Tree, BRIN, and Partial Indexes for 20M+ Rows'
description: 'Stop putting standard B-Trees on every column. How swapping to BRIN and partial expression indexes saved 18 GB of RAM and 4x’d ingestion throughput on a production cluster.'
pubDate: 'Feb 18 2026'
heroImage: '../../assets/images/hero-postgresql-indexing.webp'
category: 'Databases'
tags: ['postgresql', 'databases', 'backend', 'performance']
author: 'Piush KS'
---

When software engineers run into slow database queries, the default response is almost instinctual:
> *"The query is doing a sequential scan. Just add an index on that column."*

Six months later, the database has ballooned from 50 GB to 180 GB. Half of that storage is index bloat. Write latency has doubled, VACUUM processes are running around the clock, and the database buffer cache is thrashing because your B-Trees no longer fit into RAM.

Earlier this year, we worked on an analytics table logging mobile client telemetry events. The table was ingesting **24 million rows per week**. Queries filtering by timestamp and user status were grinding to a halt, taking 2.4 seconds per aggregate search.

Here is how replacing unconstrained B-Trees with **BRIN (Block Range Index)** and **Partial Expression Indexes** shaved 18 GB of RAM, restored sub-15ms query execution, and tripled our ingestion throughput.

---

### Why B-Trees Break Down on Massive Append-Only Tables

A standard PostgreSQL B-Tree stores a pointer for **every single row** in your table. If your table has 30,000,000 rows, your B-Tree index has 30,000,000 leaf entries.

```
STANDARD B-TREE:
[ Root Node ] ──> [ Internal Node ] ──> [ Leaf Pages ] (One entry per row!)
* 30M rows = ~3.8 GB to 5.2 GB of disk space PER INDEX!
* Must be held entirely in shared_buffers RAM for fast lookups.

BRIN (BLOCK RANGE INDEX):
[ Table Block 0 - 127 ]:   Min: '2026-01-01', Max: '2026-01-02'
[ Table Block 128 - 255 ]: Min: '2026-01-03', Max: '2026-01-04'
* Stores only summary metadata for physical disk ranges!
* 30M rows = ~38 KB of disk space! Fits entirely in CPU L2 cache!
```

If you have five B-Tree indexes on a table (e.g. `created_at`, `status`, `user_id`, `event_type`, `tenant_id`), every single `INSERT` statement must write to the table's heap *plus* update all five B-Tree balanced trees on disk. Under heavy write throughput, this write amplification crushes flash I/O and triggers high CPU locking.

---

### The Secret Weapon: BRIN (Block Range Indexes)

If your data is naturally correlated with physical insertion order (like a `created_at` timestamp, an auto-incrementing ID, or sequential sensor log dates), you almost certainly do **not** need a B-Tree.

A **BRIN** index doesn't index individual rows. Instead, it inspects chunks of physical disk blocks (default: 128 pages, or 1 MB of disk) and records only the **minimum** and **maximum** values present in that block range:

```sql
-- Replace a 4.2 GB B-Tree with a 48 KB BRIN index:
CREATE INDEX idx_telemetry_created_at_brin 
ON client_events USING brin(created_at) 
WITH (pages_per_range = 64);
```

When you query:
```sql
SELECT count(*) FROM client_events 
WHERE created_at BETWEEN '2026-02-01' AND '2026-02-02';
```
PostgreSQL consults the tiny BRIN index, instantly skips 98% of physical disk blocks that lie outside that date range, and reads only the relevant physical pages.

#### Storage & RAM Comparison (20 Million Rows)

| Index Type | Index Size on Disk | Creation Time | RAM Buffer Footprint |
| :--- | :--- | :--- | :--- |
| **Standard B-Tree (`created_at`)** | **3,840 MB (3.84 GB)** | 94.2 s | High (~3.8 GB) |
| **BRIN (`created_at`, range 64)** | **42 KB (0.000042 GB)** | **1.8 s** | Negligible (Fits in L3 cache) |
| **Savings** | **-99.99% Disk Saved** | **52x Faster Build** | **Freed ~3.8 GB RAM** |

---

### Technique 2: Partial Indexes for Skewed Status Flags

In our telemetry table, 98% of events were processed successfully (`status = 'processed'`). Only 2% were failures requiring operational triage (`status = 'failed'`).

Developers frequently create an index on the entire column:
```sql
-- ANTIPATTERN: Indexes all 20,000,000 rows, 98% of which are never queried
CREATE INDEX idx_events_status ON client_events (status);
```

Because 98% of rows share the same value, the PostgreSQL query planner will reject this index anyway and choose a sequential scan due to low cardinality.

Instead, create a **Partial Index** that indexes only the rows you actually search for:

```sql
-- GOOD: Indexes ONLY the 2% failed events!
CREATE INDEX idx_events_failed_only 
ON client_events (created_at DESC, error_code) 
WHERE status = 'failed';
```

#### The Results:
- **Index Size**: Dropped from 1.8 GB down to **18 MB**.
- **Insert Cost**: 98% of inserts do not touch the index at all! Zero write amplification for successful events.
- **Query Speed**: Operations dashboard query dropped from 1,840ms to **1.8ms**.

---

### Step-by-Step Production Audit Query

Want to see which unused B-Trees are currently eating your production RAM? Run this diagnostic query on your PostgreSQL cluster:

```sql
SELECT
    schemaname || '.' || relname AS table_name,
    indexrelname AS index_name,
    pg_size_pretty(pg_relation_size(i.indexrelid)) AS index_size,
    idx_scan AS number_of_scans,
    idx_tup_read AS tuples_read,
    idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes i
JOIN pg_index USING (indexrelid)
WHERE indisunique IS FALSE
ORDER BY pg_relation_size(i.indexrelid) DESC
LIMIT 10;
```

If you see a 4 GB index with `number_of_scans = 0` or a very low scan count, it is doing nothing except slowing down your inserts and stealing buffer cache from your hot queries.

---

### Conclusion

PostgreSQL is one of the greatest pieces of engineering software ever written, but default settings and naive indexing patterns will catch up with you at scale. Before adding your next B-Tree, ask yourself: Is this data sequentially ordered on disk? Is this query filtering for a tiny subset of rows? If so, BRIN and Partial Indexes will save your storage budget and keep your database lightning fast.
