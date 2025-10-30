# 🎨 Visual Layout Guide - Overview Dashboard

## Page Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    NAVIGATION BAR (Top)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║   WELCOME SECTION (Gradient Blue → Indigo)               ║  │
│  ║   👋 Welcome back, [User Name]!                          ║  │
│  ║   Here's what's happening with [Startup Name]            ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              STATS GRID (6 Cards - 3 columns)              ││
│  ├──────────────┬──────────────┬──────────────┐               ││
│  │   📍 Blue    │   📅 Green   │   📄 Purple  │               ││
│  │ Current      │  Weekly      │  Documents   │               ││
│  │ Stage        │  Updates     │              │               ││
│  │ VALIDATION   │     4        │      12      │               ││
│  └──────────────┴──────────────┴──────────────┘               ││
│  ├──────────────┬──────────────┬──────────────┐               ││
│  │  📈 Orange   │   💡 Pink    │  🚀 Indigo   │               ││
│  │ KPI Records  │    Value     │   Overall    │               ││
│  │     ↑        │ Proposition  │   Progress   │               ││
│  │     28       │   Created    │     80%      │               ││
│  └──────────────┴──────────────┴──────────────┘               ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │          OVERALL PROGRESS OVERVIEW (Card)                   ││
│  │                                                              ││
│  │  🚀 Startup Progress Overview                               ││
│  │                                                              ││
│  │  Overall Completion                            80%          ││
│  │  [████████████████████░░░░░] ← Gradient Bar                ││
│  │                                                              ││
│  │  ✅ Weekly Updates (4)      ✅ Monthly Updates (2)         ││
│  │  ✅ KPIs Tracked (28)       ✅ Documents (12)              ││
│  │  ✅ Value Proposition                                       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │         ⚡ QUICK ACTIONS (6 Buttons - 3 columns)           ││
│  ├──────────────┬──────────────┬──────────────┐               ││
│  │   💡 Pink    │   📊 Indigo  │   📅 Blue    │               ││
│  │    Value     │   Business   │  Log Weekly  │               ││
│  │ Proposition  │    Model     │    Update    │               ││
│  └──────────────┴──────────────┴──────────────┘               ││
│  ├──────────────┬──────────────┬──────────────┐               ││
│  │  📈 Green    │  📄 Purple   │  👥 Orange   │               ││
│  │   Update     │   Upload     │    Mentor    │               ││
│  │    KPIs      │  Document    │   Feedback   │               ││
│  └──────────────┴──────────────┴──────────────┘               ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌───────────────────────────┬───────────────────────────────┐ │
│  │  📊 Latest Weekly Update  │  💬 Latest Mentor Feedback   │ │
│  │                           │                               │ │
│  │  Week 3 - January 2025   │  From: John Smith            │ │
│  │                           │  Score: 8/10 🎯              │ │
│  │  ✅ Milestones Achieved:  │  "Great progress on MVP..."  │ │
│  │  • Completed MVP design   │                               │ │
│  │  • Secured first customer │  → Action Items:             │ │
│  │  • Hired developer        │  • Focus on marketing        │ │
│  │                           │  • Prepare pitch deck        │ │
│  │  ⚠️ Challenges:           │                               │ │
│  │  • Budget constraints     │                               │ │
│  └───────────────────────────┴───────────────────────────────┘ │
│                                                                   │
│  ┌───────────────────────────┬───────────────────────────────┐ │
│  │   📈 Recent KPIs          │   📄 Recent Documents        │ │
│  │                           │                               │ │
│  │  🟢 MARKETING             │  📄 Business Plan.pdf        │ │
│  │  Social Followers         │  FINANCIAL - 2024-01-10      │ │
│  │  2024-01-15 | 5,420       │                               │ │
│  │                           │  📄 Incorporation Cert       │ │
│  │  🔵 SALES                 │  LEGAL - 2024-01-08          │ │
│  │  Revenue                  │                               │ │
│  │  2024-01-14 | $12,500     │  📄 Pitch Deck v2           │ │
│  │                           │  PITCH_DECK - 2024-01-05     │ │
│  │  ⚪ PRODUCT               │                               │ │
│  │  Features Completed       │  📄 Product Photos          │ │
│  │  2024-01-12 | 8           │  PRODUCT_PHOTOS - 2024-01-03│ │
│  │                           │                               │ │
│  │  View all 28 KPIs →       │  View all 12 documents →     │ │
│  └───────────────────────────┴───────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │     📚 BUSINESS PLANNING STATUS (Gradient Card)            ││
│  │                                                              ││
│  │  ┌─────────────────────┬─────────────────────┐            ││
│  │  │  💡 Value Prop      │  📊 Business Model  │            ││
│  │  │  ✅ Status          │  Canvas             │            ││
│  │  │                     │                     │            ││
│  │  │  Your value prop    │  Map out your       │            ││
│  │  │  has been defined.  │  complete business  │            ││
│  │  │                     │  model with all 9   │            ││
│  │  │  [Review & Update]  │  building blocks.   │            ││
│  │  │   (Pink Button)     │  [Open Canvas]      │            ││
│  │  │                     │  (Indigo Button)    │            ││
│  │  └─────────────────────┴─────────────────────┘            ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Business Model Canvas Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Business Model Canvas                     [How to Use] [Save]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Version Name: [__________________________]  Status: [DRAFT ▼]  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 1️⃣ Customer Segments                                        ││
│  │ ┌─────────────────────────────────────────────────────────┐││
│  │ │ Tech-savvy millennials ages 25-40 who value...         │││
│  │ │                                                         │││
│  │ └─────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 2️⃣ Value Propositions                                       ││
│  │ ┌─────────────────────────────────────────────────────────┐││
│  │ │ AI-powered task automation that saves...                │││
│  │ └─────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 3️⃣ Channels                                                  ││
│  │ ┌─────────────────────────────────────────────────────────┐││
│  │ │ Social media marketing, direct sales...                 │││
│  │ └─────────────────────────────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
│  ... (6 more blocks)                                             │
│                                                                   │
│  [Save New Version]  [Update This Version]  [Reset Form]        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ 📋 Version History                                           ││
│  │                                                              ││
│  │  Initial Canvas v1      [DRAFT]    Jan 15, 2025            ││
│  │  [Load] [Update] [Delete]                                   ││
│  │                                                              ││
│  │  Pivot Version          [ACTIVE]   Jan 10, 2025            ││
│  │  [Load] [Update] [Delete]                                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Tutorial Modal Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    [X] Close                                     │
│                                                                   │
│           📚 Business Model Canvas Tutorial                      │
│                                                                   │
│  ┌───────────────────┬───────────────────┐                      │
│  │  📺 Video 1       │  📺 Video 2       │                      │
│  │  Introduction     │  Customer         │                      │
│  │  [YouTube Embed]  │  Segments         │                      │
│  └───────────────────┴───────────────────┘                      │
│                                                                   │
│  ┌───────────────────┬───────────────────┐                      │
│  │  📺 Video 3       │  📺 Video 4       │                      │
│  │  Value Props      │  Revenue          │                      │
│  │  [YouTube Embed]  │  Streams          │                      │
│  └───────────────────┴───────────────────┘                      │
│                                                                   │
│  💡 Pro Tips                                                     │
│  • Start with customer segments                                 │
│  • Iterate based on feedback                                    │
│  • Keep it simple initially                                     │
│                                                                   │
│  ⚠️ Common Mistakes                                              │
│  • Too many customer segments                                   │
│  • Vague value propositions                                     │
│  • Unrealistic revenue assumptions                              │
│                                                                   │
│  🎯 Action Steps                                                 │
│  1. Fill all 9 blocks with simple text                          │
│  2. Save as your first version                                  │
│  3. Test with real customers                                    │
│  4. Update based on learning                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Color Scheme Reference

### Primary Colors
```
🔵 Blue (#3B82F6)
   - Weekly updates
   - Current stage
   - General actions

🟢 Green (#10B981)
   - KPIs
   - Growth metrics
   - Success indicators

🟣 Purple (#8B5CF6)
   - Documents
   - Mentor feedback
   - Information

🟠 Orange (#F59E0B)
   - Trends
   - Warnings
   - Mentorship

🌸 Pink (#EC4899)
   - Value proposition
   - Creative planning
   - Innovation

🔷 Indigo (#6366F1)
   - Business model
   - Overall progress
   - Strategic planning

🟡 Yellow (#EAB308)
   - Low completion
   - Needs attention
   - Alerts
```

### Status Colors
```
✅ Green: Complete/Active/Up Trend
⚠️ Yellow: Pending/In Progress
🔴 Red: Down Trend/Urgent
⚪ Gray: Neutral/Inactive
```

## Icon Legend

```
📊 BarChart3       - KPIs, analytics
📅 Calendar        - Weekly updates, scheduling
📄 FileText        - Documents, files
💡 Lightbulb       - Value proposition, ideas
📚 Layers          - Business model, structure
👥 Users           - Mentors, team, relationships
🎯 Target          - Goals, objectives, milestones
🚀 Rocket          - Progress, launch, growth
💬 MessageSquare   - Feedback, communication
✅ CheckCircle     - Completed, verified
⚠️ AlertCircle     - Warning, needs attention
🕐 Clock           - Time, pending
📈 TrendingUp      - Positive growth
📉 TrendingDown    - Negative trend
⚡ Zap             - Quick actions, energy
📖 BookOpen        - Planning, documentation
🔥 Activity        - Recent activity, live updates
⬆️ ArrowUpRight    - Increase, improvement
💰 DollarSign      - Revenue, financial
```

## Responsive Breakpoints

```
Mobile (< 768px):
┌─────────────┐
│  Stat Card  │
├─────────────┤
│  Stat Card  │
├─────────────┤
│  Stat Card  │
└─────────────┘

Tablet (768px - 1024px):
┌─────────┬─────────┐
│  Card   │  Card   │
├─────────┼─────────┤
│  Card   │  Card   │
└─────────┴─────────┘

Desktop (> 1024px):
┌──────┬──────┬──────┐
│ Card │ Card │ Card │
├──────┼──────┼──────┤
│ Card │ Card │ Card │
└──────┴──────┴──────┘
```

## Animation Timeline

```
Page Load:
0ms    → Stats cards fade in (staggered)
200ms  → Progress bar animates width
400ms  → Quick actions appear
600ms  → Recent activity loads

Hover Effects:
0ms    → Border color transition (300ms)
0ms    → Background color fade (200ms)
100ms  → Icon scale 1.0 → 1.1
150ms  → Shadow elevation increase

Button Click:
0ms    → Scale down 0.95
100ms  → Scale return to 1.0
200ms  → Navigate to page
```

## Data Flow Diagram

```
User Interface ←→ State Management ←→ API Routes ←→ Database

┌──────────────┐
│   Text Input │
│ (9 fields)   │
└──────┬───────┘
       │ User types
       ↓
┌──────────────┐
│ simpleFields │
│   (state)    │
└──────┬───────┘
       │ Click "Save"
       ↓
┌──────────────┐
│  Convert to  │
│ Structured   │
└──────┬───────┘
       │ POST /api/business-model
       ↓
┌──────────────┐
│   MongoDB    │
│  (Prisma)    │
└──────┬───────┘
       │ Fetch
       ↓
┌──────────────┐
│  Structured  │
│    Data      │
└──────┬───────┘
       │ Convert back
       ↓
┌──────────────┐
│   Display    │
│  Text Input  │
└──────────────┘
```

---

**This visual guide helps understand the complete layout and design system!** 🎨
