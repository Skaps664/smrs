# Value Proposition Canvas - Feature Documentation

## Overview
The Value Proposition Canvas is a strategic tool that helps startups design and iterate their value propositions with full version control and history tracking.

## Features Implemented

### 1. **Dual-Sided Canvas Layout**
- **Value Proposition Side** (Orange theme):
  - Gain Creators - How your products/services create customer gains
  - Products & Services - Core offerings
  - Pain Relievers - How you eliminate or reduce customer pains

- **Customer Segment Side** (Blue theme):
  - Customer Gains - Outcomes and benefits customers want
  - Customer Pains - Problems and frustrations customers face
  - Customer Jobs - Functional, social, and emotional jobs customers need done

### 2. **Version Management**
- Create unlimited versions of your canvas
- Version naming (e.g., "Initial Canvas", "Q2 2025 Pivot")
- Auto-incrementing version numbers
- Status tracking: Draft, Active, or Archived

### 3. **Version History**
- Toggle-able history sidebar
- View all previous versions with dates
- Quick version switching
- Edit or delete any version
- Visual status indicators with icons

### 4. **Dynamic Form System**
- Add/remove items dynamically for each field
- Array-based inputs for flexibility
- Target audience specification
- Additional notes section

### 5. **Database Schema**
```prisma
model ValueProposition {
  id                    String                  @id @default(auto()) @map("_id") @db.ObjectId
  startupId             String                  @db.ObjectId
  versionName           String
  versionNumber         Int                     @default(1)
  status                ValuePropositionStatus  @default(DRAFT)
  gainCreators          String[]
  productsServices      String[]
  painRelievers         String[]
  customerGains         String[]
  customerPains         String[]
  customerJobs          String[]
  notes                 String?
  targetAudience        String?
  createdAt             DateTime                @default(now())
  updatedAt             DateTime                @updatedAt
}
```

### 6. **API Endpoints**
- `GET /api/value-proposition` - Fetch all versions
- `POST /api/value-proposition` - Create new version
- `PUT /api/value-proposition` - Update existing version
- `DELETE /api/value-proposition?id={id}` - Delete version

## User Interface

### Navigation
- Added to dashboard sidebar with Lightbulb icon
- Positioned between Timeline and Documents

### Views
1. **Empty State** - First-time user experience with call-to-action
2. **View Mode** - Read-only display of selected version
3. **Edit Mode** - Modify existing version
4. **Create Mode** - Design new version from scratch

### Design Elements
- Orange gradient for Value Proposition side
- Blue gradient for Customer Segment side
- Status badges with color coding:
  - Active: Green
  - Draft: Yellow
  - Archived: Gray
- Responsive grid layout
- Smooth transitions and hover effects

## Usage Workflow

1. **Create First Version**
   - Click "New Version" button
   - Fill in version name and target audience
   - Add gain creators, products/services, and pain relievers
   - Add customer gains, pains, and jobs
   - Set status (Draft/Active/Archived)
   - Save

2. **View History**
   - Click "Show History" to toggle sidebar
   - Click any version to view it
   - See chronological list with dates and status

3. **Edit Version**
   - Select version from history
   - Click "Edit Version"
   - Modify any fields
   - Save changes

4. **Create New Iteration**
   - Based on learnings or pivots
   - Click "New Version"
   - Version number auto-increments
   - Previous versions remain accessible

## Best Practices

### Version Naming
- Use descriptive names: "Initial Canvas", "Post-MVP Iteration", "B2B Pivot"
- Include dates or quarters: "Q2 2025", "March 2025 Update"
- Reference events: "Post-Beta Feedback", "Investor Presentation"

### Status Management
- **Draft**: Work in progress, not yet validated
- **Active**: Current version being executed
- **Archived**: Historical versions for reference

### Filling the Canvas
- Be specific and concise
- Focus on customer language, not internal jargon
- Prioritize top 3-5 items per section
- Update regularly based on customer feedback

## Technical Notes

### TypeScript Interface
```typescript
export interface ValueProposition {
  id: string
  startupId: string
  versionName: string
  versionNumber: number
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  gainCreators: string[]
  productsServices: string[]
  painRelievers: string[]
  customerGains: string[]
  customerPains: string[]
  customerJobs: string[]
  notes?: string
  targetAudience?: string
  createdAt: Date
  updatedAt: Date
}
```

### Database Indexes
- `[startupId, versionNumber]` - Fast version lookups
- `[startupId, createdAt]` - Chronological queries

## Future Enhancements (Optional)
- Version comparison side-by-side
- Export canvas as PDF/image
- Collaboration features (comments, reviews)
- Canvas templates for different industries
- AI-powered suggestions based on industry data
- Integration with KPI tracking to validate assumptions

## Access
Navigate to: `/dashboard/value-proposition`

---

**Created**: October 30, 2025
**Status**: Production Ready
