# Business Model Canvas - Implementation Guide

## Overview
The Business Model Canvas is a strategic management tool that provides a visual framework for developing, describing, and analyzing business models. This implementation includes all 9 essential building blocks with versioning, AI-powered prompts, and guided input.

## The 9 Building Blocks

### 1. **Customer Segments** (Who)
**Icon:** Users | **Color:** Blue

**Description:** Define the different groups of people or organizations your enterprise aims to reach and serve.

**Key Questions:**
- Who are you creating value for?
- Who are your most important customers?
- Are they mass market, niche market, segmented, diversified, or multi-sided platforms?

**Data Structure:**
```typescript
{
  segment: string           // Name of the segment
  description: string       // Detailed description
  size?: string            // Market size estimate
  demographics?: string    // Age, gender, location, income
  psychographics?: string  // Attitudes, values, lifestyle
}
```

**Examples:**
- Young professionals (25-35) seeking career growth
- Small businesses with 10-50 employees
- Enterprise clients in financial services

---

### 2. **Value Propositions** (What)
**Icon:** Gift | **Color:** Orange

**Description:** The bundle of products and services that create value for a specific customer segment.

**Key Questions:**
- What core value do you deliver to customers?
- Which customer problems are you solving?
- What makes you different from competitors?
- What job are you helping customers get done?

**Data Structure:**
```typescript
{
  proposition: string    // The value proposition statement
  problem: string       // Problem being solved
  solution: string      // How you solve it
  uniqueness?: string   // What makes it unique
}
```

**Examples:**
- Save 10 hours/week on administrative tasks
- Increase sales by 25% through data-driven insights
- 24/7 automated customer support

---

### 3. **Channels** (How - Reach)
**Icon:** TrendingUp | **Color:** Green

**Description:** How you communicate with and reach your customer segments to deliver your value proposition.

**Key Questions:**
- How do customers discover your product?
- How do customers purchase from you?
- How do you deliver value to customers?
- What are your post-purchase touchpoints?

**Data Structure:**
```typescript
{
  channel: string       // Channel name
  phase: string         // Awareness, Evaluation, Purchase, Delivery, After-sales
  type: string          // Online, Offline, Mixed
  direct: boolean       // Direct or partner channel
}
```

**Examples:**
- Direct sales team for enterprise clients
- E-commerce website with payment gateway
- Mobile app with in-app purchases
- Partner network and resellers

---

### 4. **Customer Relationships** (How - Interact)
**Icon:** MessageSquare | **Color:** Purple

**Description:** The types of relationships your enterprise establishes with specific customer segments.

**Key Questions:**
- How do you acquire new customers?
- How do you retain existing customers?
- How do you grow revenue from customers?
- Is it automated or personal assistance?

**Data Structure:**
```typescript
{
  type: string           // Personal, Automated, Self-service, Community, Co-creation
  description: string    // How it works
  strategy?: string      // Acquisition, retention, or upsell
  automation?: boolean   // Is it automated
}
```

**Examples:**
- Personal onboarding and dedicated account manager
- Self-service platform with community support
- Automated email nurturing campaigns
- Co-creation with early adopters

---

### 5. **Revenue Streams** (Money In)
**Icon:** DollarSign | **Color:** Emerald

**Description:** The cash a company generates from each customer segment.

**Key Questions:**
- What are customers willing to pay for?
- How do they currently pay?
- What is your pricing model?
- What percentage of total revenue does each stream represent?

**Data Structure:**
```typescript
{
  stream: string         // Revenue stream name
  type: string          // Asset sale, Usage fee, Subscription, Licensing, Advertising
  pricingModel: string  // Fixed, Dynamic, Freemium, Tiered
  frequency: string     // One-time, Monthly, Annual, Per-use
}
```

**Examples:**
- Monthly SaaS subscription ($49-$199/month)
- Transaction fees (2.9% + $0.30 per transaction)
- One-time license fees ($5,000-$50,000)
- Freemium model with premium features

---

### 6. **Key Resources** (Assets)
**Icon:** Boxes | **Color:** Indigo

**Description:** The most important assets required to make your business model work.

**Key Questions:**
- What physical, intellectual, human, and financial resources do you need?
- What assets are most important to your business?
- What do you own vs. lease vs. acquire from partners?

**Data Structure:**
```typescript
{
  resource: string      // Resource name
  type: string         // Physical, Intellectual, Human, Financial
  ownership: string    // Owned, Leased, From partners
  importance: string   // Critical, Important, Nice-to-have
}
```

**Examples:**
- Proprietary AI algorithm and IP portfolio
- 20-person engineering team
- Cloud infrastructure (AWS)
- Brand reputation and customer data

**Types of Resources:**
- **Physical:** Equipment, buildings, vehicles, systems, POS, distribution networks
- **Intellectual:** Brands, proprietary knowledge, patents, copyrights, partnerships, customer databases
- **Human:** Talent, expertise, creative minds
- **Financial:** Cash, lines of credit, stock option pools

---

### 7. **Key Activities** (Actions)
**Icon:** Zap | **Color:** Yellow

**Description:** The most important things your company must do to make its business model work.

**Key Questions:**
- What are the most important actions your company must take to operate?
- What activities are essential to deliver your value proposition?
- Production, problem solving, or platform/network activities?

**Data Structure:**
```typescript
{
  activity: string       // Activity name
  category: string      // Production, Problem-solving, Platform/Network
  frequency: string     // Daily, Weekly, Monthly, Ongoing
  owner?: string        // Team or person responsible
}
```

**Examples:**
- Software development and product updates
- Customer acquisition and marketing campaigns
- Quality assurance and testing
- Customer success and support

**Categories:**
- **Production:** Design, manufacturing, delivery
- **Problem Solving:** Consulting, knowledge management, R&D, continuous training
- **Platform/Network:** Platform management, service provisioning, platform promotion

---

### 8. **Key Partnerships** (Allies)
**Icon:** Handshake | **Color:** Pink

**Description:** The network of suppliers and partners that make the business model work.

**Key Questions:**
- Who are your strategic partners?
- Why do you partner with them?
- What resources or activities do they provide?
- Are they for optimization, risk reduction, or resource acquisition?

**Data Structure:**
```typescript
{
  partner: string         // Partner name
  type: string           // Strategic alliance, Co-opetition, Joint venture, Supplier
  value: string          // What they provide
  relationship?: string  // Nature of relationship
}
```

**Examples:**
- Payment processor (Stripe) for transactions
- AWS for cloud infrastructure
- Marketing agency for demand generation
- Integration partners for ecosystem expansion

**Types of Partnerships:**
- **Strategic Alliances:** Between non-competitors
- **Co-opetition:** Strategic partnerships between competitors
- **Joint Ventures:** To develop new businesses
- **Buyer-Supplier:** To assure reliable supplies

**Motivations:**
1. Optimization and economy of scale
2. Reduction of risk and uncertainty
3. Acquisition of particular resources and activities

---

### 9. **Cost Structure** (Money Out)
**Icon:** Receipt | **Color:** Red

**Description:** All costs incurred to operate your business model.

**Key Questions:**
- What are your biggest costs?
- Which resources are most expensive?
- Which activities are most expensive?
- Are you cost-driven or value-driven?

**Data Structure:**
```typescript
{
  cost: string          // Cost item name
  type: string         // Personnel, Infrastructure, Operations, Marketing, R&D
  fixed: boolean       // Fixed or variable cost
  frequency: string    // Monthly, Annual, Per-unit, One-time
  importance: string   // Critical, Important, Moderate, Low
}
```

**Examples:**
- Engineering salaries ($500K/year)
- Cloud hosting and infrastructure ($50K/year)
- Customer acquisition cost ($200 per customer)
- Office and operations ($100K/year)

**Cost Types:**
- **Fixed Costs:** Salaries, rent, utilities (don't vary with volume)
- **Variable Costs:** Raw materials, per-transaction fees (vary with volume)

**Cost Structures:**
- **Cost-Driven:** Minimize costs everywhere, lean operations, automation, outsourcing
- **Value-Driven:** Focus on value creation, premium offerings, personalized service

---

## Features Implemented

### 1. **Version Management**
- Create multiple canvas versions
- Track evolution of business model over time
- Compare different iterations
- Status tracking: Draft, Testing, Active, Archived

### 2. **AI-Powered Prompts**
Each block includes:
- **Key Questions:** Thought-provoking questions to guide thinking
- **Examples:** Real-world examples for inspiration
- **Help Text:** Detailed guidance on what to include
- **Toggle Help:** Show/hide guidance to reduce clutter

### 3. **Structured Data Entry**
- Field-specific inputs for each block type
- Dropdowns for standardized options
- Text areas for detailed descriptions
- Checkboxes for binary choices

### 4. **Progress Tracking**
- Completion percentage calculation (blocks filled / 9)
- Visual progress bar
- Real-time updates as you fill sections

### 5. **Version History**
- Sidebar showing all versions
- Quick version switching
- Edit and delete capabilities
- Status badges and completion indicators

## Technical Implementation

### Database Schema
```prisma
model BusinessModelCanvas {
  id                    String                  @id
  startupId             String
  versionName           String
  versionNumber         Int
  status                BusinessModelStatus
  
  // 9 blocks stored as JSON arrays
  customerSegments      Json[]
  valuePropositions     Json[]
  channels              Json[]
  customerRelationships Json[]
  revenueStreams        Json[]
  keyResources          Json[]
  keyActivities         Json[]
  keyPartnerships       Json[]
  costStructure         Json[]
  
  notes                 String?
  targetMarket          String?
  completionPercentage  Int?
  
  createdAt             DateTime
  updatedAt             DateTime
}
```

### API Endpoints
- `GET /api/business-model` - Fetch all versions
- `POST /api/business-model` - Create new version
- `PUT /api/business-model` - Update existing version
- `DELETE /api/business-model?id={id}` - Delete version

### Components
- `BlockEditor` - Reusable component for editing each block
- `BlockView` - Read-only display of block data
- Integrated help system with prompts and examples

## Usage Workflow

### Creating Your First Canvas

1. **Click "New Canvas"**
   - Enter a version name (e.g., "Initial Model", "Post-Pivot")
   - Select status (Draft recommended for new canvases)
   - Optionally add target market

2. **Fill Each Block Systematically**
   - Start with Customer Segments (who you serve)
   - Then Value Propositions (what you offer)
   - Work through all 9 blocks
   - Use the help prompts for guidance

3. **Save and Iterate**
   - Save as Draft while working
   - Change to Testing when validating
   - Mark as Active when executing
   - Archive old versions

### Best Practices

1. **Start Simple:** Don't overthink initially, capture key points
2. **Use Examples:** Reference provided examples for inspiration
3. **Be Specific:** Quantify where possible (numbers, percentages, timelines)
4. **Update Regularly:** Business models evolve, create new versions quarterly
5. **Validate Assumptions:** Test each hypothesis before committing
6. **Link to KPIs:** Connect revenue streams and costs to your KPI dashboard

### Common Patterns

**B2C SaaS:**
- Customer Segments: Consumer personas by demographic
- Channels: App stores, content marketing, paid ads
- Revenue: Monthly subscription, freemium
- Relationships: Automated onboarding, self-service

**B2B Enterprise:**
- Customer Segments: Companies by size/industry
- Channels: Direct sales, partnerships
- Revenue: Annual contracts, implementation fees
- Relationships: Dedicated account management

**Marketplace:**
- Customer Segments: Two-sided (buyers and sellers)
- Value Prop: Match supply with demand
- Revenue: Commission, listing fees
- Network Effects: Key activity

## Next Steps

1. **Complete the UI Implementation:** Add full block editors with all field types
2. **Add Comparison View:** Side-by-side comparison of two versions
3. **Export Functionality:** Download as PDF or image
4. **AI Suggestions:** GPT-powered recommendations based on industry
5. **Validation Checklist:** Built-in checklist for model validation
6. **Integration:** Link to Financial Projections and KPI Dashboard

## Resources

- Book: "Business Model Generation" by Alexander Osterwalder
- Tool: Strategyzer platform for more advanced features
- Community: Join startup forums to see examples from real companies

---

**Status:** Foundation Complete - Core Implementation Ready
**Next:** Complete detailed block editors and view components
**Access:** `/dashboard/business-model`
