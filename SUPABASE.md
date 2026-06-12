# Supabase Integration Guide for SentinelX

SentinelX now supports real-time database persistence, transitioning the hackathon prototype into a stateful, production-grade enterprise SaaS compliance dashboard. 

If Supabase credentials are not provided, the application will automatically fall back to secure, in-memory state tracking to ensure the demo never crashes during your presentation.

---

## 🚀 Step 1: Create a Supabase Project

1. Go to [Supabase.com](https://supabase.com/) and log in (or create a free account).
2. Click **New Project** and select your organization.
3. Choose a project name (e.g., `sentinelx-db`), set a database password, and choose a region close to you.
4. Wait for the database instance to finish provisioning (usually takes 1-2 minutes).

---

## 💾 Step 2: Create the Database Table

Once your project is ready:
1. Navigate to the **SQL Editor** tab from the left sidebar in the Supabase Dashboard.
2. Click **New Query**.
3. Paste the following SQL script into the editor and click **Run**:

```sql
-- Create the persistent state table for SentinelX
CREATE TABLE IF NOT EXISTS sentinelx_state (
  id INT PRIMARY KEY DEFAULT 1,
  regulations JSONB NOT NULL,
  systems_state JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Seed initial records if empty
INSERT INTO sentinelx_state (id, regulations, systems_state) 
VALUES (
  1,
  '[]'::jsonb,
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;
```

---

## 🔑 Step 3: Configure Environment Variables

1. Go to **Project Settings** (gear icon) -> **API** in the Supabase Dashboard.
2. Find your **Project URL** and the **anon public API key**.
3. Open your local `.env` file in the root of the `sentinelx-ai` folder.
4. Add your credentials like so:

```env
# Supabase Persistence Integration
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here"
```

5. Save the `.env` file. The SentinelX server will automatically pick up these credentials on startup!

---

## ⚙️ How It Works

* **GET /api/systems-state**: When the dashboard loads or refreshes, the server queries Supabase for the latest state. If the table is empty, it automatically seeds it with the default compliance regulations and active drift nodes (retaining the beautiful Out-of-the-Box setup).
* **POST /api/systems-state**: Every time you complete a JIRA ticket, trigger a playbook threat, or resolve an infrastructure drift on the digital twin, the frontend pushes the state to the backend, which saves it to Supabase.
* **Auto-remounting Regulations**: Any regulation ingested via PDF or legal text parser (online Gemini/offline heuristics) is immediately saved to the database. Next time you refresh, your custom ingested data remains!
