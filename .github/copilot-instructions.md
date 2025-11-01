# GitHub Copilot Instructions for SMRS Project

## 🎯 Core Instruction: Always Update PROJECT_OVERVIEW.md

**CRITICAL:** Whenever you make ANY change to this project (code, documentation, structure, dependencies), you MUST also update the `PROJECT_OVERVIEW.md` file to reflect those changes.

---

## 📋 When to Update PROJECT_OVERVIEW.md

### 1. New Features or Pages
When adding any new feature or page:
- ✅ Update the **"Current Implementation Status"** section
- ✅ Move the feature from "Remaining" to "Completed" table
- ✅ Add new API endpoints to the **"API Endpoints Reference"** section
- ✅ Update the **"Project Structure"** section with new files
- ✅ Update **"Data Flow & User Journeys"** if user flow changes

**Example:** Adding Monthly Tracker page
```markdown
Update sections:
- ✅ Project Structure → Add `/dashboard/monthly/page.tsx`
- ✅ API Endpoints → Document `/api/monthly` endpoints
- ✅ Implementation Status → Move from 🚧 to ✅
- ✅ Data Flow → Add "Monthly Progress Tracking Flow"
```

---

### 2. Database Schema Changes
When modifying `prisma/schema.prisma`:
- ✅ Update **"Database Architecture"** section
- ✅ Update **"Data Models & Relationships"** section
- ✅ Update the schema diagram if relationships change
- ✅ Add new model documentation with all fields

**Example:** Adding a new model
```markdown
Add to "Database Architecture" section:
- Document all fields with types
- Explain relationships
- Show indexes
- Provide usage examples
```

---

### 3. API Changes
When adding/modifying API routes:
- ✅ Update **"API Endpoints Reference"** table
- ✅ Add request/response examples
- ✅ Update authentication requirements
- ✅ Document query parameters
- ✅ Update the **"API Architecture"** section if design changes

---

### 4. Technology Stack Changes
When adding/removing dependencies in `package.json`:
- ✅ Update **"Technology Stack"** tables
- ✅ Add version numbers
- ✅ Explain purpose of new dependencies
- ✅ Update installation instructions if needed

**Example:** Adding React Query
```markdown
Update "Frontend Technologies" table:
| Technology | Version | Purpose |
|-----------|---------|---------|
| React Query | 5.x | Server state management and caching |
```

---

### 5. Configuration Changes
When modifying config files:
- ✅ Update **"Configuration"** section in Project Structure
- ✅ Document new environment variables
- ✅ Update deployment instructions if affected

---

### 6. Security or Authentication Changes
When modifying auth system:
- ✅ Update **"Security Architecture"** section
- ✅ Update **"Authentication Flow"** diagram
- ✅ Document new security measures
- ✅ Update environment variables section

---

### 7. Deployment Changes
When changing deployment setup:
- ✅ Update **"Deployment Architecture"** section
- ✅ Update hosting provider information
- ✅ Modify setup steps
- ✅ Update cost estimates

---

### 8. Removing or Deprecating Features
When removing features:
- ✅ Remove from "Completed Features" section
- ✅ Update implementation status percentage
- ✅ Remove API documentation
- ✅ Update data models if database changes
- ✅ Add note to **"Changelog & Version History"**

---

## 📝 Update Template

When making changes, follow this template:

```markdown
### Section to Update: [Section Name]

#### What Changed:
- [Brief description of change]

#### Updates Made:
- [ ] Updated section X with new information
- [ ] Added new subsection Y
- [ ] Removed outdated information Z
- [ ] Updated diagrams/charts if applicable
- [ ] Updated version number at bottom of document
```

---

## 🔄 Specific Section Guidelines

### Updating "Implementation Status"
```markdown
✅ Completed Features (60% → 65%)

Move feature from 🚧 to ✅:
| Feature | Status | Files |
|---------|--------|-------|
| Monthly Tracker | ✅ Complete | `/api/monthly`, `/dashboard/monthly/page.tsx` |
```

### Updating "API Endpoints Reference"
```markdown
| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/monthly` | GET | Get monthly trackers | Yes |
| `/api/monthly` | POST | Create monthly tracker | Yes |

**GET /api/monthly**
[Add request/response examples]
```

### Updating "Database Architecture"
```markdown
#### X. **ModelName Model**
Brief description.

**Fields:**
- `fieldName` (Type) - Description
- `anotherField` (Type) - Description

**Relationships:**
- N:1 with ParentModel
- 1:N with ChildModel

**Index:** `[field1, field2]`
```

---

## 🚫 What NOT to Update

Do not update PROJECT_OVERVIEW.md for:
- ❌ Typo fixes in code comments
- ❌ Minor CSS/styling changes
- ❌ Temporary debugging code
- ❌ Small refactoring that doesn't change functionality
- ❌ Running tests or builds

---

## ✅ Update Checklist

Before completing any task, verify:

- [ ] All relevant sections in PROJECT_OVERVIEW.md are updated
- [ ] New features documented with complete information
- [ ] Code examples provided where helpful
- [ ] Diagrams updated if architecture changed
- [ ] Version/date updated at bottom of document
- [ ] Links/references updated
- [ ] Tables have correct formatting
- [ ] Status percentages recalculated

---

## 📊 Version Control

Update the document version at the bottom:

```markdown
**Document Version:** X.Y.Z
**Last Updated:** [Current Date]
```

**Version Scheme:**
- **Major (X.0.0):** Complete project milestones, major architecture changes
- **Minor (0.Y.0):** New features completed, significant sections added
- **Patch (0.0.Z):** Bug fixes, minor updates, documentation improvements

---

## 💡 Best Practices

1. **Be Specific:** Don't just say "updated API" - specify which endpoint and what changed
2. **Keep It Current:** Update immediately when making changes, not later
3. **Maintain Consistency:** Use the same formatting and style as existing content
4. **Add Examples:** Include code snippets and JSON examples for new features
5. **Update All Related Sections:** A single change might affect multiple sections
6. **Check Links:** Ensure all file paths and references are correct
7. **Preserve Structure:** Don't change the overall document organization
8. **Be Detailed:** This document is for investors/buyers - they need complete information

---

## 🎯 Priority Sections to Keep Updated

**High Priority (Always Update):**
1. Implementation Status (% complete)
2. API Endpoints Reference
3. Database Architecture
4. Technology Stack
5. Current Implementation Status tables

**Medium Priority (Update When Relevant):**
6. Project Structure
7. Data Flow & User Journeys
8. Deployment Architecture
9. Changelog & Version History

**Low Priority (Update Occasionally):**
10. FAQ section
11. Learning Resources
12. Future Enhancements

---

## 🔍 Self-Check Questions

Before finishing any task, ask:

1. ✅ Did I add/modify any files? → Update Project Structure
2. ✅ Did I add/modify API endpoints? → Update API Reference
3. ✅ Did I change the database? → Update Database Architecture
4. ✅ Did I add dependencies? → Update Technology Stack
5. ✅ Did I complete a feature? → Update Implementation Status
6. ✅ Did I change how users interact? → Update Data Flow
7. ✅ Is PROJECT_OVERVIEW.md still accurate? → Verify and update

---

## 📖 Example Update Workflow

**Scenario:** Developer adds KPI Dashboard with Recharts

**Steps:**
1. Code the feature (`/dashboard/kpis/page.tsx`)
2. Create API routes (`/api/kpi/route.ts`)
3. Test functionality
4. **Update PROJECT_OVERVIEW.md:**
   - ✅ Move "KPI Dashboard" from 🚧 to ✅ in Implementation Status
   - ✅ Update completion percentage (60% → 65%)
   - ✅ Add KPI API endpoints to API Reference section
   - ✅ Add code examples for Recharts usage
   - ✅ Update "Data Flow & User Journeys" with KPI tracking flow
   - ✅ Verify Recharts is listed in Technology Stack
   - ✅ Update version number and date
5. Commit both code changes AND documentation update together

---

## 🤝 Collaboration Notes

**For Multiple Developers:**
- Coordinate updates to avoid conflicts
- Review PROJECT_OVERVIEW.md in code reviews
- Ensure consistency in documentation style
- Discuss major structural changes to the document

**For Project Handoffs:**
- Verify all sections are current before handoff
- Add notes about work-in-progress items
- Update contact information
- Ensure all links and references work

---

## 📌 Quick Reference: Common Updates

### Adding a New Page
```markdown
Update:
- Project Structure → app/dashboard/[page]/page.tsx
- Implementation Status → Move to ✅
- Data Flow → Add user journey
```

### Adding an API Endpoint
```markdown
Update:
- API Endpoints Reference → Add table row + examples
- Project Structure → app/api/[route]/route.ts
```

### Changing Database
```markdown
Update:
- Database Architecture → Update model documentation
- Data Models & Relationships → Update diagram
- API section → If endpoints changed
```

### Adding Dependency
```markdown
Update:
- Technology Stack → Add to appropriate table
- Installation steps → If setup changes
```

---

## ⚠️ Critical Reminder

**PROJECT_OVERVIEW.md is the SINGLE SOURCE OF TRUTH for this project.**

When investors, buyers, or new developers need to understand the system, they read this document first. Keeping it accurate and up-to-date is NOT optional - it's a core requirement of every task.

**Before marking any task as complete, ensure PROJECT_OVERVIEW.md accurately reflects the current state of the project.**

---

**This instruction file last updated:** October 31, 2025  
**Applies to:** All project modifications and additions  
**Priority:** CRITICAL - Always follow
