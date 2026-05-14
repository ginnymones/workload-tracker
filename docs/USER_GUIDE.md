# Workload Tracker — User Guide

## What is Workload Tracker?

Workload Tracker is a personal productivity tool that helps you log, visualize, and share how you spend your working hours. It answers questions like:

- Where is my time actually going each day?
- Am I spending enough time on deep, meaningful work?
- Am I being stretched too thin across too many activities?
- Are meetings eating into my focus time?

The tool is designed to give you (and your team) visibility into workload distribution — not as a surveillance tool, but as a way to understand patterns, protect focus time, and have informed conversations about capacity.

---

## Key Concepts

### Work Categories

Every entry you log falls into one of these categories:

| Category | What it covers |
|----------|---------------|
| **Deep Work** | Focused, uninterrupted work — coding, writing, designing, problem-solving |
| **Meetings** | Syncs, standups, 1:1s, all-hands, client calls |
| **Code Review** | Reviewing pull requests, providing feedback on others' work |
| **Planning** | Sprint planning, roadmap discussions, backlog grooming |
| **Admin** | Email, Slack, documentation, expense reports, time tracking |
| **Mentoring** | Pair programming, coaching, onboarding new team members |
| **Learning** | Reading, courses, conference talks, exploring new tools |
| **Other** | Anything that doesn't fit the above |

### Capacity and the 85% Productivity Flag

Your daily capacity defaults to **8 hours**. The tool flags you when you hit **85% capacity** (6.8 hours of logged productive work).

Why 85%? Because not every minute of your workday is — or should be — spent on trackable tasks. The remaining **15% accounts for:**

- Short breaks and mental resets
- Informal conversations that don't warrant a log entry
- Context switching between tasks
- Bio breaks, coffee, stretching
- The natural overhead of being human at work

When you see the "Nearing capacity" warning, it means you've logged a full, productive day. It's a signal to wind down, not a target to exceed.

If you consistently hit or exceed 100%, that's a sign you may be overloaded — use that data to have a conversation with your manager about workload balance.

### Productivity Assessment

At the top of your dashboard, you'll see a daily assessment that adapts to your work pattern:

- **🎯 Deep work day** — 50%+ of your time in focused work
- **💡 Meeting-heavy day** — 50%+ in meetings, with a suggestion to protect focus time tomorrow
- **🔀 Context switching** — 5+ different work types in a day
- **⚡ Over capacity** — logged more than your max hours
- **🌱 Growth day** — meaningful time spent on learning or mentoring
- **✨ Balanced day** — healthy mix across categories

These are meant to be light and motivational — not judgmental.

---

## How to Use the Tool

### Logging Your Work

1. **Sign in** at the app URL using your Google account
2. Navigate to the **Log** page (click "+ Log Entry" in the header, or go to `/log`)
3. Fill in:
   - **Date** — defaults to today, but you can backfill previous days
   - **Category** — select the type of work
   - **Hours** — how long you spent (supports quarter-hour increments: 0.25, 0.5, 1.5, etc.)
   - **Description** (optional) — a short note about what you worked on
4. Click **Log Entry**

You can also use the **Quick Add** bar on the dashboard for faster entry without leaving the page.

**Tips:**
- Log as you go throughout the day, or do a single end-of-day recap
- Don't stress about precision — rounding to the nearest 15 minutes is fine
- You can delete entries if you make a mistake (hover over an entry to see the delete button)

### Reading Your Dashboard

The dashboard (`/`) shows your personal workload data:

- **Productivity Note** — today's assessment and tips (top of page)
- **Capacity Meter** — how much of your daily capacity you've used
- **Category Breakdown** — pie chart showing where your time went
- **Hours per Day** — bar chart with a red dashed line at your capacity limit
- **Weekly Trends** — stacked area chart showing category distribution over the past 7 days
- **Entry Log** — list of all entries for the selected period

Use the **Today / This Week** toggle to switch between daily and weekly views.

### Sharing Your Dashboard

If you want others to see your workload (your manager, teammates, stakeholders):

1. Go to **Settings** (`/settings`)
2. Set a **username** (this becomes your public URL)
3. Toggle **Public dashboard** on
4. Share your URL: `https://[app-url]/dashboard/[your-username]`

Anyone with the link can view your workload — no login required. They see the same charts and data you do, but can't edit anything.

To make your dashboard private again, toggle it off in Settings.

### Adjusting Your Capacity

Everyone's workday is different. To change your limits:

1. Go to **Settings** (`/settings`)
2. Adjust **Max hours/day** (default: 8)
3. Adjust **Warning at %** (default: 85%)
4. Click **Save Settings**

---

## FAQ

**Do I need to log exactly 8 hours every day?**
No. Log what you actually worked on. Some days are 6 hours, some are 9. The tool helps you see patterns, not enforce a quota.

**Can others edit my entries?**
No. Only you can log, edit, or delete your own entries. The public dashboard is read-only.

**What if I forget to log for a few days?**
You can backfill by changing the date when creating an entry. The trends will still be accurate.

**Is this a time-tracking tool for billing?**
No. It's a visibility and self-awareness tool. It's intentionally lightweight — no timers, no screenshots, no approval workflows.

---

## Summary

| Feature | Details |
|---------|---------|
| Log workload | By category, hours, and optional description |
| Daily capacity | 8 hours default, 85% productivity flag |
| Productivity assessment | Motivational, context-aware daily note |
| Visualizations | Pie chart, bar chart, trend chart, capacity meter |
| Sharing | Public dashboard via username URL (toggleable) |
| Privacy | Your data, your control — public/private toggle |
