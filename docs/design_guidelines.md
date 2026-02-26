# Comprehensive UI Design Prompt for Cipherion Compliance Dashboard

## Brand Identity

- **Brand Name**: Cipherion
- **Primary Color**: #6d18ff (Vibrant Purple)
- **Industry**: B2B SaaS - AI-Powered Compliance Management Platform
- **Design Philosophy**: Modern, trustworthy, intelligent, enterprise-grade

## Color Palette Extension

```
Primary: #6d18ff (Vibrant Purple) - Main brand color
Primary Dark: #5412cc (Darker Purple) - Hover states, headings
Primary Light: #8f4dff (Lighter Purple) - Backgrounds, accents
Primary Pale: #e9ddff (Very Light Purple) - Subtle backgrounds

Secondary Colors:
- Accent Purple: #a855f7 (for secondary CTAs)
- Deep Indigo: #4c1d95 (for depth and contrast)

Semantic Colors:
- Success/Compliant: #10b981 (Green)
- Warning/Partial: #f59e0b (Amber)
- Error/Non-Compliant: #ef4444 (Red)
- Info/Not Started: #8b5cf6 (Soft Purple)
- Not Applicable: #3b82f6 (Blue)

Neutrals:
- Gray-50: #fafafa
- Gray-100: #f5f5f5
- Gray-200: #e5e5e5
- Gray-400: #a3a3a3
- Gray-600: #525252
- Gray-800: #262626
- Gray-900: #171717
```

---

## Page 1: Login/Signup Page

**Design Brief:**
Create a split-screen authentication experience that balances professionalism with modern design. The Cipherion brand should feel intelligent, secure, and forward-thinking.

**Layout:**

- **Desktop**: 60/40 split layout
  - Left side (60%): Brand experience area
  - Right side (40%): Authentication form
- **Mobile**: Single column, stacked layout

**Left Side - Brand Experience:**

- **Background**: Subtle gradient from #6d18ff to #4c1d95 with abstract geometric patterns or animated particles
- **Content**:
  - Cipherion logo (white/light) - top left (32px padding)
  - Large heading: "AI-Powered Compliance, Simplified" (48px, white, semi-bold)
  - Subheading: "Discover, assess, and maintain regulatory readiness across multiple frameworks—automatically" (18px, white/80% opacity)
  - Feature highlights (with icons):
    - "✓ AI Framework Mapping"
    - "✓ Real-time Compliance Scoring"
    - "✓ Automated Remediation Plans"
    - "✓ Audit-Ready Reports"
  - Trust indicators: "SOC 2 Compliant" and "GDPR Ready" badges
  - Background illustration: Abstract shield, lock, or compliance-related iconography in subtle white/purple outlines

**Right Side - Authentication Form:**

**Login View:**

- **Background**: White (#ffffff)
- **Container**: Centered card with 48px padding
- **Header**:
  - "Welcome back" (24px, Gray-900, semi-bold)
  - "Sign in to your Cipherion account" (14px, Gray-600)
- **Form Fields**:
  - Email input:
    - Label: "Email address"
    - Placeholder: "you@company.com"
    - Icon: Envelope icon (left side)
  - Password input:
    - Label: "Password"
    - Placeholder: "Enter your password"
    - Icon: Lock icon (left side)
    - Show/hide password toggle (right side)
  - "Remember me" checkbox (left)
  - "Forgot password?" link (right, purple #6d18ff)
- **Primary CTA**:
  - "Sign in" button (full width, purple #6d18ff, white text, 44px height)
  - Hover state: #5412cc
  - Loading state: Spinner animation
- **Divider**: "OR" with horizontal lines
- **Secondary Action**:
  - "Don't have an account? Sign up" (Gray-600 text, purple link)
- **Footer**:
  - "© 2026 Cipherion. All rights reserved" (small, Gray-400)

**Signup View:**

- **Similar layout to login**
- **Header**:
  - "Create your account" (24px, Gray-900, semi-bold)
  - "Start your compliance journey with Cipherion" (14px, Gray-600)
- **Form Fields**:
  - Full Name input (Person icon)
  - Company Name input (Building icon)
  - Work Email input (Envelope icon)
  - Password input (Lock icon)
  - Password strength indicator (progress bar below password)
    - Weak: Red, "Weak password"
    - Medium: Yellow, "Medium password"
    - Strong: Green, "Strong password"
  - Confirm Password input
  - Checkbox: "I agree to Cipherion's Terms of Service and Privacy Policy" (with links in purple)
- **Primary CTA**:
  - "Create account" button (full width, purple, white text)
- **Secondary Action**:
  - "Already have an account? Sign in" (Gray-600 text, purple link)

**Microinteractions:**

- Input focus: Purple border (#6d18ff) with subtle glow
- Button hover: Darker purple with slight elevation
- Password strength bar animates as user types
- Form validation messages appear below fields (red for errors, green for success)
- Smooth transitions between login/signup views

---

## Page 2: Dashboard - Empty State (New User Onboarded)

**Design Brief:**
Create an inviting, non-intimidating first experience that guides new users toward their first assessment. The empty state should feel encouraging and clear about next steps.

**Layout:**

**Top Navigation Bar** (Fixed):

- **Background**: White with subtle bottom border (Gray-200)
- **Left**: Cipherion logo (purple version) + "Dashboard" text
- **Center**: Navigation links
  - "Dashboard" (active - purple text with underline)
  - "Assessments" (Gray-600)
  - "Reports" (Gray-600)
- **Right**:
  - Help icon button (Gray-600)
  - Notifications bell (with badge if needed)
  - User avatar with dropdown (hover shows menu)

**Sidebar Navigation** (Optional, left side):

- **Width**: 240px
- **Background**: Gray-50
- **Items**:
  - Dashboard (icon + text, purple highlight if active)
  - Assessments (icon + text)
  - Reports (icon + text)
  - Settings (icon + text)
- **Bottom**: "Need help?" support card

**Main Content Area:**

**Hero Section** (Top):

- **Background**: Gradient card from #e9ddff to white (subtle)
- **Padding**: 48px
- **Content**:
  - Welcome message: "Welcome to Cipherion, [User Name]! 👋" (32px, Gray-900, semi-bold)
  - Subheading: "Let's start your compliance journey by creating your first assessment" (16px, Gray-600)
  - Illustration: Abstract dashboard illustration with compliance icons (charts, checkmarks, shields) in purple tones

**Empty State Card** (Center, large):

- **Background**: White with subtle border
- **Padding**: 64px
- **Icon**: Large illustration or icon (compliance checklist, shield with checkmark) in purple (#6d18ff) and light purple tones
- **Heading**: "No assessments yet" (24px, Gray-900, semi-bold)
- **Description**: "Create your first compliance assessment to discover which regulatory frameworks apply to your business and start tracking your compliance readiness." (16px, Gray-600, max-width: 500px, centered)
- **Primary CTA**:
  - "Create Your First Assessment" button (large, purple, white text with arrow icon →)
  - Size: 52px height, prominent
  - Hover: Darker purple with slight elevation
- **Secondary Info**:
  - "Takes about 5 minutes to complete" (14px, Gray-500, with clock icon)

**Quick Start Guide** (Below empty state):

- **Section Title**: "How it works" (20px, Gray-900, semi-bold)
- **3-Column Card Layout**:

  **Card 1**:
  - Number badge: "1" (in purple circle)
  - Icon: Document/form icon
  - Title: "Describe Your Business" (16px, semi-bold)
  - Description: "Tell us about your product, services, and data handling" (14px, Gray-600)

  **Card 2**:
  - Number badge: "2" (in purple circle)
  - Icon: AI/sparkle icon
  - Title: "AI Analyzes Requirements" (16px, semi-bold)
  - Description: "Our AI suggests applicable compliance frameworks for you" (14px, Gray-600)

  **Card 3**:
  - Number badge: "3" (in purple circle)
  - Icon: Checklist icon
  - Title: "Complete Assessment" (16px, semi-bold)
  - Description: "Work through controls and track your compliance progress" (14px, Gray-600)

**Help Resources** (Bottom section):

- **Heading**: "Need guidance?" (18px, semi-bold)
- **Resource Cards** (2-column):
  - "📚 View Documentation" (card with icon, title, link)
  - "🎥 Watch Tutorial Video" (card with icon, title, link)
  - "💬 Contact Support" (card with icon, title, link)
  - "📅 Schedule Demo" (card with icon, title, link)

**Visual Style:**

- Use purple accents throughout (#6d18ff)
- Ample whitespace
- Soft shadows on cards (subtle)
- Rounded corners (8px on cards, 6px on buttons)
- Friendly, encouraging copy
- Professional illustrations in purple color scheme

---

## Page 3: Dashboard - Active State (User with Existing Assessments)

**Design Brief:**
Transform the dashboard into a powerful overview showing compliance status, progress, and actionable insights. Data visualization should be clear and actionable.

**Layout:**

**Same Top Navigation & Sidebar as Empty State**

**Page Header:**

- **Title**: "Dashboard" (28px, Gray-900, semi-bold)
- **Subtitle**: "Welcome back, [User Name]. Here's your compliance overview." (16px, Gray-600)
- **Right aligned**: "Create New Assessment" button (purple, medium size)

**Key Metrics Row** (Top, 4-column grid):

**Card 1 - Total Assessments:**

- Large number: "3" (32px, Gray-900, bold)
- Label: "Active Assessments" (14px, Gray-600)
- Icon: Clipboard checklist (purple)
- Trend: "+1 this month" (12px, green text with up arrow)

**Card 2 - Average Compliance Score:**

- Large number: "72%" (32px, Purple #6d18ff, bold)
- Label: "Avg. Compliance Score" (14px, Gray-600)
- Mini circular progress indicator (purple)
- Trend: "+5% from last month" (12px, green text)

**Card 3 - Critical Risks:**

- Large number: "4" (32px, Red #ef4444, bold)
- Label: "Critical Gaps" (14px, Gray-600)
- Icon: Warning triangle (red)
- Action: "View details →" (12px, purple link)

**Card 4 - Reports Generated:**

- Large number: "2" (32px, Gray-900, bold)
- Label: "Reports Generated" (14px, Gray-600)
- Icon: Document (purple)
- Action: "View all →" (12px, purple link)

**Main Content - Two Column Layout:**

**Left Column (70%):**

**Section 1: Active Assessments**

- **Header**: "Your Assessments" (20px, semi-bold) with "View all →" link
- **Assessment Cards** (stacked, max 3 visible):

  **Each Assessment Card:**
  - **Background**: White with border, hover: slight elevation
  - **Layout**: Left-to-right
  - **Left side**:
    - Assessment name: "HealthTrack App Compliance" (18px, semi-bold)
    - Frameworks: Badge pills (HIPAA, GDPR, PCI-DSS) in light purple backgrounds
    - Last updated: "2 hours ago" (12px, Gray-500 with clock icon)
  - **Center**:
    - Circular progress: 68% (medium size, purple)
    - Status text: "In Progress" or "Completed" (badge)
  - **Right side**:
    - "82/120 items completed" (14px, Gray-600)
    - Mini framework breakdown:
      - HIPAA: 72% (mini bar)
      - GDPR: 65% (mini bar)
      - PCI-DSS: 68% (mini bar)
  - **Bottom row**:
    - "Continue Assessment" button (purple, outlined)
    - "View Report" button (gray, outlined)
    - More options (three dots menu)

**Section 2: Recent Activity**

- **Header**: "Recent Activity" (20px, semi-bold)
- **Timeline view**:
  - Purple vertical line connecting items
  - Each activity:
    - Icon (checkmark, warning, document)
    - Action: "Control marked compliant: GDPR-7.1"
    - User: "by Sarah Chen"
    - Timestamp: "2 hours ago"
    - Subtle hover state

**Right Column (30%):**

**Section 1: Quick Actions Card**

- **Background**: Purple gradient (#6d18ff to #5412cc)
- **Text**: White
- **Content**:
  - Icon: Sparkle/AI icon
  - Heading: "Start New Assessment" (18px, bold)
  - Description: "Let our AI guide you" (14px)
  - Button: "Get Started →" (white button with purple text)

**Section 2: Compliance Health**

- **Card background**: White
- **Heading**: "Compliance Health" (16px, semi-bold)
- **Donut Chart**:
  - Center: Overall score "72%"
  - Segments:
    - Compliant (green)
    - Partially Compliant (yellow)
    - Non-Compliant (red)
    - Not Started (gray)
  - Legend below with counts

**Section 3: Top Priority Risks**

- **Heading**: "Action Required" (16px, semi-bold)
- **List items** (max 3):
  - Severity badge (Critical/High)
  - Control name (truncated)
  - Framework (small badge)
  - "Fix now →" link (purple)

**Section 4: Upcoming Tasks**

- **Heading**: "Upcoming" (16px, semi-bold)
- **List**:
  - "Complete HIPAA assessment (Due: 3 days)"
  - "Review remediation plan (Due: 5 days)"
  - Each with checkbox and due date badge

**Visual Enhancements:**

- All cards have subtle shadows
- Purple accents on interactive elements
- Smooth hover states with transitions
- Data visualizations use brand purple as primary color
- Charts and graphs have purple gradients
- Loading states use purple spinner

---

## Page 4: New Assessment Creation - Business Profile Input

**Design Brief:**
Create a guided, multi-step form experience that feels conversational and not overwhelming. Use progressive disclosure and helpful hints.

**Layout:**

**Progress Indicator** (Top, fixed):

- **Background**: White with bottom border
- **Step indicators**: Horizontal stepper
  - Step 1: "Business Profile" (active - purple circle with checkmark or number)
  - Step 2: "Framework Selection" (inactive - gray circle)
  - Step 3: "Review & Create" (inactive - gray circle)
- **Progress bar**: Purple bar showing 33% completion
- **Exit**: "Save & Exit" button (top right, ghost style)

**Page Header:**

- **Title**: "Tell us about your business" (32px, Gray-900, semi-bold)
- **Subtitle**: "Help our AI understand your compliance needs by providing some basic information" (16px, Gray-600)
- **Time estimate**: "⏱ About 5 minutes" (14px, Gray-500, in badge)

**Main Form Container** (Centered, max-width: 800px):

- **Background**: White card with padding
- **Shadow**: Soft elevation

**Form Sections** (Progressive, well-spaced):

**Section 1: Product Information**

- **Section heading**: "Product Information" (20px, semi-bold, with number badge "1")
- **Divider**: Thin purple line

**Field 1 - Product/Service Name:**

- Label: "Product or Service Name" (14px, Gray-700, semi-bold)
- Helper text: "What do you call your product?" (12px, Gray-500)
- Input: Text field with placeholder "e.g., HealthTrack App"
- Character count: "0/100" (bottom right, small)

**Field 2 - Business Description:**

- Label: "Business Description" (14px, Gray-700, semi-bold)
- Helper text: "Briefly describe what your product/service does" (12px, Gray-500)
- Input: Textarea (4 rows) with placeholder "e.g., A mobile application that helps users track their fitness goals and nutrition..."
- Character count: "0/500"

**Field 3 - Services Offered:**

- Label: "Services Offered" (14px, Gray-700, semi-bold)
- Helper text: "What specific services do you provide?" (12px, Gray-500)
- Input: Textarea (3 rows) with placeholder "e.g., Data analytics, personalized recommendations, meal planning..."
- Character count: "0/300"

**Field 4 - Target Customers:**

- Label: "Target Customers" (14px, Gray-700, semi-bold)
- Helper text: "Who uses your product?" (12px, Gray-500)
- Input: Textarea (2 rows) with placeholder "e.g., Individual consumers, fitness enthusiasts, health-conscious adults..."
- Character count: "0/200"

**Field 5 - Problem Being Solved:**

- Label: "Problem Being Solved" (14px, Gray-700, semi-bold)
- Helper text: "What problem does your product solve?" (12px, Gray-500)
- Input: Textarea (3 rows) with placeholder "e.g., Difficulty tracking health metrics consistently, lack of personalized nutrition guidance..."
- Character count: "0/300"

**Section 2: Data Handling** (Spacing above: 48px)

- **Section heading**: "Data Handling" (20px, semi-bold, with number badge "2")
- **Divider**: Thin purple line
- **Description**: "Select all types of data your business collects or processes" (14px, Gray-600)

**Data Type Checkboxes** (Grid layout, 2 columns):

- Each checkbox item:
  - Large checkbox (purple when checked)
  - Icon representing data type
  - Label (bold): "Personally Identifiable Information (PII)"
  - Helper text: "Names, emails, addresses, phone numbers"
  - Examples in tooltip (info icon)

**Options:**

1. ✓ PII (Personally Identifiable Information)
   - Icon: User icon
   - Helper: "Names, emails, addresses..."
2. ✓ PHI (Protected Health Information)
   - Icon: Heart/medical icon
   - Helper: "Health records, medical data..."
3. ✓ Financial Data
   - Icon: Dollar sign
   - Helper: "Bank accounts, financial statements..."
4. ✓ Payment Card Data
   - Icon: Credit card
   - Helper: "Card numbers, CVV, billing info..."
5. ☐ Biometric Data
   - Icon: Fingerprint
   - Helper: "Fingerprints, facial recognition..."
6. ☐ Children's Data
   - Icon: Baby/child icon
   - Helper: "Data from users under 13/16..."
7. ✓ Employee Data
   - Icon: Briefcase
   - Helper: "Employee records, HR data..."
8. ☐ Other
   - Icon: Plus icon
   - Opens text field if checked

**Section 3: Regions of Operation** (Spacing above: 48px)

- **Section heading**: "Regions of Operation" (20px, semi-bold, with number badge "3")
- **Divider**: Thin purple line
- **Description**: "Select all regions where your business operates" (14px, Gray-600)

**Region Checkboxes** (Grid layout, 2 columns):

- Similar style to data types

**Options:**

1. ✓ United States
   - Icon: US flag
2. ✓ European Union
   - Icon: EU flag
3. ☐ United Kingdom
   - Icon: UK flag
4. ☐ Canada
   - Icon: Canada flag
5. ☐ Australia
   - Icon: Australia flag
6. ☐ APAC (Asia-Pacific)
   - Icon: Globe-Asia
7. ☐ Latin America
   - Icon: Globe
8. ☐ Other
   - Opens text field

**Auto-save Indicator** (Floating, top-right of form):

- "All changes saved" (12px, Green text with checkmark)
- Or "Saving..." (with spinner)

**Form Actions** (Bottom of card, fixed):

- **Background**: White with subtle top border
- **Padding**: 24px
- **Layout**: Flex, space-between
- **Left**: "Save Draft" button (ghost, gray)
- **Right**:
  - "Back" button (outlined, gray) - disabled on first step
  - "Next: Framework Selection →" button (solid purple, large)
    - Disabled until required fields filled
    - Enabled state: vibrant purple
    - Hover: darker purple with elevation

**Validation:**

- Real-time validation as user types
- Error messages appear below fields (red text with icon)
- Success checkmarks for completed fields (green)
- Required field indicator (red asterisk)

**Helper Features:**

- Tooltips on info icons (purple on hover)
- Example chips that user can click to auto-fill
- Character counters turn red when limit reached
- Field focus: purple border with glow
- Smooth scroll to first error on "Next" click

**Visual Style:**

- Purple accents throughout
- Clean, generous spacing (24px between sections)
- Rounded inputs (6px border radius)
- Subtle transitions on interactions
- Professional, friendly tone in helper text

---

## Page 5: AI Framework Suggestions

**Design Brief:**
Create an exciting reveal moment where AI "thinks" and then presents intelligent recommendations. The experience should feel magical yet trustworthy.

**Layout:**

**Progress Indicator** (Top):

- Step 1: Complete (green checkmark)
- Step 2: Active (purple, "Framework Selection")
- Step 3: Inactive (gray)
- Progress: 66%

**Loading State** (Initial, 3-5 seconds):

- **Full-screen overlay**: Light purple gradient background (#e9ddff)
- **Center content**:
  - **Animation**: Pulsing AI brain icon or abstract network visualization
    - Purple (#6d18ff) and light purple elements
    - Smooth, professional animation (not too playful)
  - **Text sequence** (changes every 1.5 seconds):
    - "Analyzing your business profile..."
    - "Mapping to 250+ compliance frameworks..."
    - "Identifying applicable regulations..."
    - "Calculating confidence scores..."
  - **Progress bar**: Indeterminate purple bar below text
  - **Cipherion logo**: Subtle watermark in corner

**Results View** (After loading):

**Page Header:**

- **Transition**: Fade in from loading state
- **Title**: "AI Compliance Recommendations" (32px, Gray-900, semi-bold)
- **Subtitle**: "Based on your business profile, we've identified the following compliance frameworks" (16px, Gray-600)
- **Summary badge**: "8 frameworks analyzed • 4 recommended" (purple badge)

**Confidence Explanation Card** (Top):

- **Background**: Light purple (#e9ddff) with purple left border
- **Icon**: Info icon (purple)
- **Content**:
  - "How we calculate confidence"
  - Expandable section explaining:
    - 90-100%: Very High (your business strongly matches this framework)
    - 75-89%: High (likely applicable based on your profile)
    - 60-74%: Medium (may apply, review carefully)
    - Below 60%: Not shown (low relevance)

**Framework Cards** (Main content):

- **Layout**: Stacked cards with spacing
- **Max visible**: 8 frameworks
- **Sorted by**: Confidence score (highest first)

**Individual Framework Card** (Pre-selected if confidence > 85%):

**Card Structure:**

- **Background**: White with border
- **Border**: 2px solid purple (#6d18ff) if selected, gray if not
- **Padding**: 24px
- **Hover**: Slight elevation, purple border preview
- **Click**: Toggles selection

**Card Header:**

- **Left side**:
  - Large checkbox (purple, animated check on select)
  - Framework icon/illustration (compliance-related, in purple tones)
- **Center**:
  - **Framework name**: "GDPR" (20px, Gray-900, bold)
  - **Full name**: "General Data Protection Regulation" (14px, Gray-600)
  - **Region badge**: "European Union" (small purple pill)
  - **Category badge**: "Privacy" (small gray pill)
- **Right side**:
  - **Confidence score**: Large circular progress indicator
    - 95% (in center, 24px, bold)
    - Color-coded ring:
      - 90-100%: Green ring
      - 75-89%: Blue ring
      - 60-74%: Yellow ring
  - **Confidence label**: "Very High" (12px, below circle)

**Card Body:**

- **Why this applies**: (16px, semi-bold)
- **Explanation text**:
  - "Your application processes personal data of EU residents. GDPR mandates strict data protection and privacy requirements for any organization handling EU citizen data, regardless of where your business is located." (14px, Gray-700)
  - Well-written, specific to user's input
  - 2-3 sentences

- **Key requirements** (expandable):
  - Click "View key requirements ↓" to expand
  - Bullet list:
    - "Data subject rights (access, deletion, portability)"
    - "Lawful basis for processing"
    - "Data protection impact assessments"
    - "Breach notification (72 hours)"
  - Each with icon

- **Relevance tags**:
  - Purple pill badges at bottom
  - Examples: "Personal Data", "EU Operations", "B2C", "Data Processing"

**Card Footer:**

- **Control count**: "50 controls" (12px, Gray-500 with checklist icon)
- **Typical completion time**: "~3-4 hours" (12px, Gray-500 with clock icon)
- **Learn more** link (purple, small)

**Example Cards:**

**Card 1 - GDPR (Pre-selected):**

- Checkbox: ✓ (checked)
- Confidence: 95% (green ring, "Very High")
- Border: Purple (selected)
- Explanation: Mentions EU operations, personal data processing

**Card 2 - HIPAA (Pre-selected):**

- Checkbox: ✓ (checked)
- Confidence: 90% (green ring, "Very High")
- Explanation: Mentions health data (PHI), US operations

**Card 3 - PCI-DSS (Pre-selected):**

- Checkbox: ✓ (checked)
- Confidence: 88% (blue ring, "High")
- Explanation: Mentions payment card data processing

**Card 4 - SOC 2:**

- Checkbox: ☐ (unchecked)
- Confidence: 78% (blue ring, "High")
- Explanation: SaaS security controls recommendation

**Card 5 - ISO 27001:**

- Checkbox: ☐ (unchecked)
- Confidence: 72% (yellow ring, "Medium")
- Explanation: General information security

**Card 6 - CCPA:**

- Checkbox: ☐ (unchecked)
- Confidence: 68% (yellow ring, "Medium")
- Explanation: California privacy law applicability

**Manual Addition Section:**

- **Divider**: "Or add frameworks manually" with horizontal lines
- **Dropdown**: Searchable select
  - Placeholder: "Search for a framework..."
  - Options: All available frameworks
  - Select: Adds card to list above
- **Helper text**: "Don't see what you need? You can manually search our library of 250+ frameworks"

**Selection Summary Sidebar** (Sticky, right side):

- **Background**: Light purple card
- **Heading**: "Selected Frameworks" (16px, semi-bold)
- **Count**: "3 selected" (badge)
- **List**:
  - GDPR (with remove X)
  - HIPAA (with remove X)
  - PCI-DSS (with remove X)
- **Total controls**: "120 total controls"
- **Est. completion time**: "8-10 hours"
- **Warning** (if none selected): "Select at least one framework" (red text)
- **CTA**: "Continue to Assessment →" (purple button, full width)

**Form Actions** (Bottom, fixed):

- **Left**:
  - "← Back" button (outlined, gray)
- **Right**:
  - "Skip AI suggestions" link (gray text, small)
  - "Create Assessment" button (solid purple, large)
    - Shows selected count: "Create Assessment (3 selected)"
    - Disabled if none selected

**Microinteractions:**

- Card select: Border animates to purple, checkbox fills with smooth animation
- Confidence ring: Animates in on load (circular progress animation)
- Hover states: Cards lift slightly
- Loading state: Smooth fade transition to results
- Selection count updates in real-time
- Smooth scroll to top when results appear

**Visual Polish:**

- Purple gradients on selected cards (very subtle background)
- AI "sparkle" icon next to recommendations
- Smooth animations throughout
- Cards stagger-fade in on load (0.1s delay between each)

---

## Page 6: Assessment Checklist & Compliance Tracking

**Design Brief:**
Create a comprehensive, scannable interface for working through compliance controls. Must balance detail with clarity, making it easy to track progress and update status.

**Layout:**

**Top Navigation**: Same as dashboard

**Page Header:**

- **Breadcrumb**: "Assessments / HealthTrack App Compliance" (gray, with purple on hover)
- **Title**: "HealthTrack App Compliance" (28px, Gray-900, semi-bold)
- **Status badge**: "In Progress" (yellow/amber badge)
- **Last updated**: "Last updated: 2 hours ago by Sarah Chen" (14px, Gray-500)

**Action Bar** (Below header):

- **Left**:
  - "← Back to Dashboard" link (gray)
- **Right**:
  - "Generate Report" button (outlined purple)
  - "More Actions" dropdown (three dots)
    - Export as CSV
    - Duplicate assessment
    - Delete assessment

**Key Metrics Bar** (Sticky below header):

- **Background**: White card with bottom shadow
- **4-column layout**:

**Metric 1 - Overall Progress:**

- Circular progress: 68% (large, purple)
- Label: "Overall Compliance"
- Sub-text: "82/120 items"

**Metric 2 - Framework Breakdown:**

- Mini progress bars (stacked):
  - HIPAA: 72% (with icon)
  - GDPR: 65%
  - PCI-DSS: 68%
- Click to filter by framework

**Metric 3 - Status Distribution:**

- Horizontal stacked bar:
  - Compliant: 52 (green segment)
  - Partial: 30 (yellow segment)
  - Non-compliant: 8 (red segment)
  - Not started: 30 (gray segment)
- Hover shows exact counts

**Metric 4 - Critical Gaps:**

- Large number: "2" (red, 32px)
- Label: "Critical Issues"
- Icon: Warning triangle
- Click to filter

**Filter & Search Bar:**

- **Background**: Light gray bar (Gray-50)
- **Layout**: Horizontal, left-aligned

**Search Input:**

- Placeholder: "Search controls by ID or title..."
- Icon: Search magnifying glass (left)
- Clear button (X on right when typing)
- Width: 300px

**Filter Dropdowns:**

- **Framework filter**:
  - Button: "Framework: All" (with dropdown icon)
  - Multi-select dropdown:
    - ☑ HIPAA (52 items)
    - ☑ GDPR (50 items)
    - ☑ PCI-DSS (18 items)
  - Shows count of selected
- **Status filter**:
  - Button: "Status: All"
  - Multi-select with status colors:
    - ☐ Compliant (52) - green
    - ☐ Partially Compliant (30) - yellow
    - ☐ Not Compliant (8) - red
    - ☐ Not Started (30) - gray
- **Severity filter**:
  - Button: "Severity: All"
  - Multi-select:
    - ☐ Critical (12) - red badge
    - ☐ High (35) - orange badge
    - ☐ Medium (48) - yellow badge
    - ☐ Low (25) - blue badge

**Applied Filters Display:**

- Pills showing active filters
- Example: "HIPAA ×", "Not Compliant ×"
- "Clear all" link (purple)

**Sort Dropdown:**

- Button: "Sort by: Severity ↓"
- Options:
  - Severity (High to Low)
  - Status (Not Started first)
  - Control ID (A-Z)
  - Last Updated (Newest)

**Main Content - Checklist:**

**Grouped by Framework** (Collapsible sections):

**Section Header** (HIPAA):

- **Layout**: Full-width, clickable
- **Left**:
  - Expand/collapse chevron icon
  - Framework icon (medical cross for HIPAA)
  - "HIPAA - Administrative Safeguards"
  - Progress: "(20/50 completed)" (gray text)
- **Right**:
  - Mini progress bar: 40%
  - Framework score: "72%" (colored badge)
- **Background**: Light purple when expanded
- **Border**: Left purple accent (4px)

**Sub-section** (Collapsible):

- "Access Control" category
- "(8/15 items)"
- Lighter background than main section

**Individual Control Card:**

**Card Layout:**

- **Background**: White
- **Border**: Left accent based on status:
  - Compliant: Green (4px)
  - Partial: Yellow
  - Non-compliant: Red
  - Not started: Gray
- **Padding**: 20px
- **Hover**: Slight elevation
- **Click**: Expands detail view

**Card Header** (Collapsed view):

- **Left side** (70%):
  - **Status icon**:
    - Compliant: Green checkmark circle
    - Partial: Yellow half-circle
    - Non-compliant: Red X circle
    - Not started: Gray empty circle
  - **Control ID**: "HIPAA-164.308(a)(1)" (14px, Gray-900, mono font)
  - **Control title**: "Security Management Process" (16px, Gray-900, semi-bold)
  - **Severity badge**: "HIGH" (orange, small badge)
- **Middle** (20%):
  - **Status dropdown** (inline):
    - Current status as button
    - Colored based on status
    - Click to change (dropdown appears)
    - Options: Not Started, Compliant, Partially Compliant, Not Compliant, Not Applicable
    - Each with icon and color
- **Right side** (10%):
  - **Last updated**: "2d ago" (small, gray)
  - **Evidence count**: "2 files" (badge with document icon)
  - **Action button**: "..." (three dots)
    - Dropdown: View details, Get remediation, Add evidence, Add comment

**Card Expanded View** (Click to toggle):

- **Smooth expand animation**
- **Additional sections visible**:

**Description:**

- "Implement policies and procedures to prevent, detect, contain, and correct security violations." (14px, Gray-700)
- Well-formatted, readable

**Current Status Info:**

- Status: Compliant (with green checkmark)
- Updated: 2 days ago by Sarah Chen
- Link: "View history →"

**Comments Section:**

- **Header**: "Comments (1)" (collapsible)
- **Comment card**:
  - User avatar + name
  - Timestamp
  - Comment text: "Implemented RBAC using Auth0. All users require MFA."
  - Edit/Delete options (if user's own comment)
- **Add comment**:
  - Textarea: "Add a comment..."
  - "Post" button (purple)

**Evidence Section:**

- **Header**: "Evidence (2)" (collapsible)
- **File list**:
  - **File 1**:
    - PDF icon
    - "access-control-policy.pdf"
    - Size: "2.4 MB"
    - Uploaded: "Feb 10, 2026 by Sarah Chen"
    - Actions: View, Download, Delete
  - **File 2**: Similar layout
- **Add evidence button**:
  - "Upload Evidence" (outlined purple)
  - Click opens upload modal

**AI Remediation CTA** (if not compliant):

- **Background**: Purple gradient card
- **Icon**: AI sparkle icon (white)
- **Text**: "Need help fixing this?" (white, bold)
- **Button**: "Get AI Remediation Plan →" (white button with purple text)
- **Prominent placement** in expanded view

**Quick Actions** (Bottom of expanded card):

- "Mark as Compliant" button (if not compliant)
- "Request Help" button
- "Copy Link" button

**Pagination** (Bottom of page):

- "Showing 1-50 of 120 items"
- Page numbers: [1] 2 3 ... 10
- Next/Previous buttons
- Items per page dropdown: "Show: 50 per page"

**Floating Action Button** (Bottom right):

- **Button**: Purple circle with + icon
- **Label**: "Quick Add Evidence" (on hover)
- **Click**: Opens evidence upload drawer

**Empty States:**

**If no items match filters:**

- Icon: Search with magnifying glass (purple)
- "No controls match your filters"
- "Try adjusting your filters or search term"
- "Clear all filters" button

**If assessment just created:**

- Illustration of empty checklist
- "Ready to start your assessment!"
- "Begin by reviewing each control and updating its status"
- Guide card: "Click any control to expand and see details"

**Visual Enhancements:**

- Purple accents on interactive elements
- Status colors consistently applied
- Smooth expand/collapse animations
- Skeleton loading states when filtering
- Hover states with subtle elevation
- Progress indicators use purple
- Badges have appropriate semantic colors
- Clear visual hierarchy with typography and spacing

---

## Page 7: Compliance Metrics & Analytics Dashboard

**Design Brief:**
Create a comprehensive analytics view that provides executive-level insights and operational details. Data visualizations should be clear, actionable, and aligned with purple brand colors.

**Layout:**

**Page Header:**

- **Title**: "Compliance Analytics" (28px, Gray-900, semi-bold)
- **Subtitle**: "HealthTrack App Compliance • Last updated: 5 minutes ago" (16px, Gray-600)
- **Time range selector**:
  - Dropdown: "Last 30 days", "Last 90 days", "All time", "Custom range"
- **Export button**: "Export Dashboard" (PDF/CSV options)

**Key Metrics Overview** (Top section - 4 cards):

**Card 1 - Overall Compliance Score:**

- **Large gauge/speedometer visualization**:
  - Center: 72% (48px, Purple)
  - Needle points to 72 on 0-100 scale
  - Color zones:
    - 0-60%: Red zone
    - 60-80%: Yellow zone
    - 80-100%: Green zone
- **Trend**: "+5% from last month" (green, with up arrow)
- **Status**: "Partially Compliant" (yellow badge)
- **Action**: "View breakdown ↓"

**Card 2 - Controls Status:**

- **Donut chart**:
  - Center: "120 Total"
  - Segments:
    - Compliant: 52 (43%) - Green
    - Partially: 30 (25%) - Yellow
    - Non-compliant: 8 (7%) - Red
    - Not started: 30 (25%) - Gray
- **Legend** below with counts
- **Clickable**: Filters main view

**Card 3 - Risk Summary:**

- **Stacked bar chart** (horizontal):
  - Critical: 2 (red segment)
  - High: 8 (orange)
  - Medium: 15 (yellow)
  - Low: 9 (blue)
- **Total**: "34 gaps identified"
- **Trend**: "-3 since last week" (green)
- **Action**: "View all risks →"

**Card 4 - Assessment Progress:**

- **Progress metrics**:
  - Items completed: 82/120
  - Completion rate: 68%
  - Progress bar (purple)
- **Velocity**: "+12 items this week"
- **Estimated completion**: "14 days" (based on current pace)
- **Icon**: Calendar with date

**Framework Comparison Section:**

**Section Header:**

- "Framework Performance" (20px, semi-bold)
- "Compare compliance across different frameworks"

**Visualization - Grouped Bar Chart:**

- **X-axis**: Frameworks (HIPAA, GDPR, PCI-DSS)
- **Y-axis**: Compliance % (0-100%)
- **Bars for each framework**:
  - Overall score (dark purple)
  - Compliant controls (green)
  - Target score (dotted line)
- **Interactive**: Hover shows exact numbers
- **Height**: ~300px

**Data Table below chart:**
| Framework | Score | Compliant | Partial | Non-Compliant | Not Started | Critical Gaps |
|-----------|-------|-----------|---------|---------------|-------------|---------------|
| HIPAA | 72% | 36/50 | 10/50 | 2/50 | 2/50 | 1 |
| GDPR | 65% | 33/50 | 12/50 | 3/50 | 2/50 | 1 |
| PCI-DSS | 68% | 13/20 | 5/20 | 1/20 | 1/20 | 0 |

- **Sortable columns**
- **Row colors**: Subtle purple tint on hover
- **Click row**: Drills down to framework details

**Compliance Trend Section:**

**Section Header:**

- "Compliance Trend" (20px, semi-bold)
- "Track your progress over time"

**Line Chart:**

- **X-axis**: Time (last 30 days)
- **Y-axis**: Compliance % (0-100%)
- **Lines**:
  - Overall score (purple, bold)
  - HIPAA score (teal)
  - GDPR score (blue)
  - PCI-DSS score (indigo)
- **Legend**: Color-coded framework names
- **Data points**: Clickable (shows exact date and value)
- **Trend zones**: Shaded background (red/yellow/green zones)
- **Height**: ~250px

**Risk Heatmap Section:**

**Section Header:**

- "Risk Heatmap" (20px, semi-bold)
- "Identify high-impact, high-severity gaps"

**2D Grid Visualization:**

- **Y-axis**: Impact (Critical, High, Medium, Low)
- **X-axis**: Framework (HIPAA, GDPR, PCI-DSS)
- **Cells**: Color intensity based on count
  - Dark red: Many critical items
  - Light red: Few items
  - White: No items
- **Cell format**:
  - Number in center
  - Hover: Shows list of specific controls
- **Click**: Filters checklist view

**Control Category Breakdown:**

**Section Header:**

- "Top Areas Requiring Attention" (20px, semi-bold)

**Horizontal Bar Chart:**

- **Categories** (Y-axis):
  - Access Control
  - Encryption
  - Audit Logging
  - Data Retention
  - Security Training
  - (Top 10 by non-compliance count)
- **Bars** (X-axis): Count of non-compliant items
- **Color**: Gradient from purple to red based on count
- **Values**: Numbers at end of bars
- **Interactive**: Click bar to filter checklist

**Activity Timeline:**

**Section Header:**

- "Recent Activity" (20px, semi-bold)
- "Last 7 days"

**Timeline visualization:**

- **Vertical timeline** (left side, purple line)
- **Events**:
  - Each event has:
    - Icon (checkmark, warning, document, user)
    - Action text: "Control marked compliant: GDPR-7.1"
    - User: "by Sarah Chen" (small, gray)
    - Timestamp: "2 hours ago"
    - Framework badge
  - Color-coded by type:
    - Compliant: Green icon
    - Non-compliant: Red icon
    - Comment added: Blue icon
    - Evidence uploaded: Purple icon
- **Limit**: Show 10 recent, "View all activity →" link

**Remediation Progress Tracker:**

**Section Header:**

- "Remediation Progress" (20px, semi-bold)

**Card grid** (2-3 columns):
Each card shows a remediation initiative:

**Card structure:**

- **Header**:
  - Control ID: "HIPAA-164.312(a)(1)"
  - Title: "Access Control Implementation"
- **Progress bar**: 60% complete (purple)
- **Status**: "In Progress" (yellow badge)
- **Owner**: Avatar + "Sarah Chen"
- **Due date**: "Due in 5 days" (with calendar icon)
- **Steps completed**: "3/5 steps complete"
- **Action**: "View plan →" button

**Insights & Recommendations Panel:**

**Background**: Light purple card
**Icon**: AI sparkle icon
**Header**: "AI Insights" (18px, semi-bold)

**Insights list:**

1. **Insight card**:
   - Icon: Lightbulb (purple)
   - "Focus on encryption controls"
   - "You have 5 high-severity encryption gaps across HIPAA and GDPR. Addressing these could improve your score by ~8%."
   - "View controls →" link

2. **Insight card**:
   - Icon: Trending up
   - "Great progress this week!"
   - "You've completed 12 controls in 7 days. At this pace, you'll achieve 80% compliance in 14 days."

3. **Insight card**:
   - Icon: Warning
   - "Critical deadline approaching"
   - "2 critical HIPAA controls are overdue. These should be addressed immediately to avoid compliance risks."
   - "View controls →" link

**Export & Share Section** (Bottom right):

- **Button**: "Schedule Report"
  - Opens modal to set up automated reporting
  - Frequency: Daily, Weekly, Monthly
  - Recipients: Email addresses
- **Button**: "Share Dashboard"
  - Generates shareable link
  - Access control options

**Visual Design Enhancements:**

- All charts use purple as primary color
- Smooth animations on load (charts draw in)
- Interactive tooltips on hover
- Responsive grid layout
- Print-friendly version available
- Loading skeletons for async data
- Empty states if no data available
- Consistent spacing and alignment

**Mobile Considerations** (if responsive):

- Stack cards vertically
- Simplify charts (fewer data points)
- Collapsible sections
- Swipeable chart views

---

## Page 8: AI Remediation Suggestions

**Design Brief:**
Create an intelligent, actionable remediation guide that feels like having a compliance expert. The interface should make complex compliance requirements feel manageable through clear, prioritized steps.

**Layout:**

**Page Context Bar** (Top, subtle):

- **Breadcrumb**: "Assessment / Checklist / HIPAA-164.312(a)(1)"
- **Control reference**: "Access Control"

**Page Header:**

- **Icon**: AI sparkle icon (purple, large)
- **Title**: "AI Remediation Plan" (28px, Gray-900, semi-bold)
- **Subtitle**: "Actionable steps to achieve compliance for this control" (16px, Gray-600)
- **Generated**: "Generated just now" (12px, Gray-500, with timestamp)

**Control Context Card** (Top):

- **Background**: Light purple (#e9ddff)
- **Layout**: Horizontal
- **Left side**:
  - **Control ID**: "HIPAA-164.312(a)(1)" (mono font, 14px)
  - **Control title**: "Access Control" (18px, semi-bold)
  - **Framework badge**: "HIPAA" (purple pill)
  - **Severity badge**: "HIGH" (orange)
- **Right side**:
  - **Current status**: Red "Not Compliant" badge
  - **Impact**: "Addressing this will improve your HIPAA score by ~4%"

**Control Description** (Expandable):

- "Implement technical policies and procedures for electronic information systems..." (14px, Gray-700)
- "Show full description ↓" (if long)

**Loading State** (Initial, 3-5 seconds):

- **Background**: White card with purple border
- **Animation**:
  - Pulsing AI brain icon or animated dots
  - Purple gradient animation
- **Text**:
  - "Analyzing compliance requirements..." (16px)
  - "Reviewing best practices..." (fades in)
  - "Generating customized plan..." (fades in)
- **Progress bar**: Indeterminate purple bar

**Main Content - Remediation Plan:**

**Action Items Section:**

**Section Header:**

- **Icon**: Checklist icon (purple)
- **Title**: "Priority Actions" (22px, semi-bold)
- **Subtitle**: "Complete these steps to achieve compliance" (14px, Gray-600)
- **Progress**: "0/5 steps completed" (updates as user checks off)

**Action Cards** (Numbered, prioritized):

**Card 1 - Highest Priority:**

- **Background**: White with left purple accent (4px)
- **Priority badge**: "HIGH PRIORITY" (red badge, top-right)
- **Number**: Large "1" (purple circle, left)

**Card Header:**

- **Title**: "Implement Role-Based Access Control (RBAC)" (18px, semi-bold)
- **Checkbox**: Large checkbox (right) - user can mark as done
  - Checked: Purple with animation
  - Shows checkmark and completion date

**Card Body:**

- **Owner chip**:
  - Icon: User/team icon
  - Text: "IT Security Team"
  - Purple background

- **Estimated effort**:
  - Icon: Clock
  - Text: "40 hours"
  - Gray background

- **Detailed steps** (expandable, default expanded):
  - **Subheading**: "Steps to complete:" (14px, semi-bold)
  - **Numbered list**:
    1. "Define user roles based on job functions (Admin, Clinician, Support Staff, etc.)"
       - Checkbox for each sub-step
    2. "Map roles to specific data access permissions and actions"
       - Checkbox
    3. "Implement RBAC in application (Recommended tools: Auth0, Okta, Azure AD)"
       - Checkbox
       - **Tool recommendations** (expandable):
         - Auth0: "Modern, developer-friendly, strong HIPAA compliance features"
         - Okta: "Enterprise-grade, extensive integration options"
         - Azure AD: "Seamless Microsoft ecosystem integration"
    4. "Document role matrix in a policy document"
       - Checkbox
       - **Template button**: "Download Policy Template" (purple link)
    5. "Test RBAC implementation with sample users from each role"
       - Checkbox
- **Resources** (expandable section):
  - **Icon**: Document icon
  - **Links**:
    - "📄 Sample RBAC Policy Template" (download)
    - "🎥 Video: Implementing RBAC for HIPAA" (external link)
    - "📚 NIST Guide to RBAC" (external link)
    - "💡 Best Practices for Role Design" (help article)

- **Code example** (if applicable):
  - **Toggle**: "Show implementation example ↓"
  - **Code block** (syntax highlighted):
    ```javascript
    // Example RBAC middleware
    function checkRole(allowedRoles) {
      return (req, res, next) => {
        if (allowedRoles.includes(req.user.role)) {
          next();
        } else {
          res.status(403).send("Forbidden");
        }
      };
    }
    ```
  - **Copy button**: Copies code to clipboard

**Card Footer:**

- **Notes section** (expandable):
  - **Icon**: Note icon
  - **User can add notes**: "Add implementation notes..."
  - **Saved notes** appear here
- **Action buttons**:
  - "Mark as Complete" (checkbox)
  - "Need Help?" (link to support)
  - "Assign to..." (if team feature enabled)

---

**Card 2 - High Priority:**

- Similar structure to Card 1
- **Number**: "2"
- **Title**: "Enable Multi-Factor Authentication (MFA)"
- **Priority**: "HIGH" (orange badge)
- **Owner**: "IT Security Team"
- **Effort**: "16 hours"
- **Steps**:
  1. "Select MFA provider (Google Authenticator, Duo, Authy)"
  2. "Enable MFA for all user accounts"
  3. "Require MFA for administrative access"
  4. "Configure backup authentication methods"
  5. "Train users on MFA setup and usage"
- **Resources**:
  - MFA implementation guides
  - User training materials

---

**Card 3 - Medium Priority:**

- **Number**: "3"
- **Title**: "Implement Access Logging and Monitoring"
- **Priority**: "MEDIUM" (yellow badge)
- **Owner**: "DevOps Team"
- **Effort**: "24 hours"
- **Steps**:
  1. "Enable access logs in application"
  2. "Set up centralized logging (Datadog, Splunk, ELK)"
  3. "Configure alerts for suspicious patterns"
  4. "Set log retention policy (6+ years for HIPAA)"
- **Resources**: Logging setup guides

---

**Card 4 - Medium Priority:**

- **Number**: "4"
- **Title**: "Create Access Control Policy Document"
- **Priority**: "MEDIUM" (yellow badge)
- **Owner**: "Compliance Team"
- **Effort**: "8 hours"
- **Steps**:
  1. "Download policy template"
  2. "Customize for your organization"
  3. "Review with legal/compliance"
  4. "Obtain executive approval"
  5. "Distribute to all employees"

---

**Card 5 - Low Priority:**

- **Number**: "5"
- **Title**: "Conduct Quarterly Access Reviews"
- **Priority**: "LOW" (blue badge)
- **Owner**: "Compliance Team"
- **Effort**: "4 hours/quarter"
- **Steps**:
  1. "Schedule quarterly review cadence"
  2. "Create access review checklist"
  3. "Review user access logs"
  4. "Revoke unnecessary permissions"
  5. "Document review findings"

---

**Policy Recommendations Section:**

**Section Header:**

- **Icon**: Document icon (purple)
- **Title**: "Required Policy Documents" (22px, semi-bold)
- **Subtitle**: "Create these policies to support this control"

**Policy Cards** (Grid, 2-column):

**Each Policy Card:**

- **Icon**: Document icon
- **Policy name**: "Access Control Policy" (16px, semi-bold)
- **Description**: "Defines who can access what data and under what circumstances" (14px, Gray-600)
- **Status badge**: "Not Created" (gray) or "Created" (green)
- **Actions**:
  - "Download Template" button (purple, outlined)
  - "Upload Policy" button (if created)
  - "Mark as Complete" checkbox

**Policies listed:**

1. Access Control Policy
2. Password Policy
3. Multi-Factor Authentication Policy
4. User Provisioning/Deprovisioning Procedures
5. Access Review Procedures

---

**Technical Controls Section:**

**Section Header:**

- **Icon**: Settings/gear icon (purple)
- **Title**: "Recommended Technical Controls" (22px, semi-bold)
- **Subtitle**: "Implement these systems and tools"

**Control Cards** (Grid, 2-column):

**Each Control Card:**

- **Icon**: Tool/system icon
- **Control name**: "Identity Provider (IdP)" (16px, semi-bold)
- **Purpose**: "Centralized authentication and authorization" (14px, Gray-600)
- **Recommended vendors**:
  - Auth0 (★★★★★ 4.8/5) - "Best for: Modern apps"
  - Okta (★★★★★ 4.7/5) - "Best for: Enterprise"
  - Azure AD (★★★★ 4.5/5) - "Best for: Microsoft stack"
- **Pricing**: Starting at $X/month
- **Action**: "Learn More →" button

**Controls listed:**

1. Identity Provider (Auth0, Okta, Azure AD)
2. Logging Platform (Datadog, Splunk, ELK Stack)
3. Secrets Management (AWS Secrets Manager, Vault)
4. Access Management Dashboard
5. Security Information and Event Management (SIEM)

---

**Implementation Timeline:**

**Section Header:**

- **Icon**: Calendar icon (purple)
- **Title**: "Suggested Implementation Timeline" (22px, semi-bold)

**Gantt-style visualization:**

- **Timeline**: 12 weeks
- **Bars** for each action:
  - Week 1-4: Implement RBAC (purple bar)
  - Week 3-5: Enable MFA (purple bar, overlapping)
  - Week 6-8: Set up logging (purple bar)
  - Week 9: Create policies (short bar)
  - Ongoing: Quarterly reviews (dotted line)
- **Milestones**:
  - Week 4: "RBAC Live"
  - Week 5: "MFA Required"
  - Week 8: "Logging Active"
  - Week 12: "Control Compliant"

---

**Cost Estimate:**

**Section Header:**

- **Icon**: Dollar sign icon
- **Title**: "Estimated Implementation Cost" (22px, semi-bold)

**Cost breakdown table:**
| Item | Cost | Notes |
|------|------|-------|
| IdP License | $200/mo | Auth0 Professional |
| Logging Platform | $150/mo | Datadog Pro |
| Labor (120 hrs @ $150/hr) | $18,000 | One-time |
| **Total First Year** | **$22,200** | |

---

**Actions Panel** (Sticky bottom or top-right):

- **Background**: Purple gradient card
- **Icon**: Rocket icon (white)
- **Text**: "Ready to implement?" (white, 16px, semi-bold)
- **Buttons**:
  - "Export Plan as PDF" (white button with purple text)
  - "Assign Tasks" (white outline)
  - "Schedule Review" (white outline)
- **Save status**: "Plan auto-saved" (white, small, with checkmark)

**Feedback Section** (Bottom):

- **Background**: Light purple card
- **Icon**: Thumbs up/down icons
- **Text**: "Was this remediation plan helpful?" (16px)
- **Buttons**:
  - "👍 Yes, very helpful" (purple)
  - "👎 Needs improvement" (gray)
  - Opens feedback form on click
- **Link**: "Request custom guidance from compliance expert →"

**Regeneration Option:**

- **Button**: "Regenerate Plan" (ghost button, bottom-left)
  - Icon: Refresh icon
  - Tooltip: "Get a new AI-generated plan"
  - Confirmation: "This will replace your current plan. Continue?"

---

**Visual Enhancements:**

- Purple accent colors throughout
- Priority badges color-coded (red/orange/yellow/blue)
- Progress indicators for checked items
- Expandable/collapsible sections with smooth animations
- Copy-to-clipboard buttons with success feedback
- Download buttons with file icons
- External links with icon indicators
- Tool recommendation cards with ratings
- Timeline visualization with interactive elements
- Cost table with clear formatting
- Sticky action panel on scroll

**Microinteractions:**

- Check animation when marking steps complete
- Progress bar updates in header as steps completed
- Confetti animation when all steps checked (optional)
- Smooth expand/collapse transitions
- Hover states on all interactive elements
- Success toast when actions saved
- Copy confirmation tooltips

---

## Page 9: Compliance Readiness Report Preview

**Design Brief:**
Create a professional, executive-ready report preview that can be shared with stakeholders, auditors, and board members. The design should balance comprehensive data with visual clarity.

**Layout:**

**Page Header** (Action bar):

- **Left**:
  - "← Back to Assessment" link
  - Report title: "Compliance Readiness Report" (20px, semi-bold)
  - Assessment name: "HealthTrack App" (14px, Gray-600)
- **Right**:
  - "Last generated: 5 minutes ago" (12px, Gray-500)
  - "Download PDF" button (purple, with download icon)
  - "Share Report" button (outlined purple)
  - "Print" button (ghost, with printer icon)
  - "More actions" dropdown (three dots)
    - Regenerate report
    - Schedule automated reports
    - Export as Word/Excel

**Report Preview Container:**

- **Background**: Gray-50 (page background)
- **Report "page"**: White card, centered, max-width 1000px
- **Padding**: Generous (like a real document page)
- **Shadow**: Paper-like elevation
- **Margin**: Space around to feel like PDF preview

---

**Cover Page:**

**Background**: White
**Layout**: Centered content

**Top section** (30% of page):

- **Company logo area**:
  - Placeholder: "Your Logo Here" or uploaded logo
  - Left-aligned or centered

**Center section** (40% of page):

- **Report title**:
  - "COMPLIANCE READINESS REPORT" (36px, Gray-900, bold, uppercase, letter-spacing)
- **Decorative line**: Purple horizontal line (2px)
- **Assessment name**:
  - "HealthTrack App" (28px, semi-bold)
- **Frameworks covered**:
  - Badge pills: HIPAA | GDPR | PCI-DSS (purple backgrounds)

**Bottom section** (30% of page):

- **Generation date**:
  - "Generated on February 13, 2026" (16px, Gray-700)
- **Prepared for**:
  - "Board of Directors" (14px, Gray-600)
  - Or customizable recipient
- **Report version**:
  - "Version 1.0" (12px, Gray-500)
- **Confidential notice**:
  - "CONFIDENTIAL - Internal Use Only" (12px, Gray-500, italic)

**Visual elements**:

- Abstract geometric pattern (very subtle, purple/gray)
- Shield or compliance icon (large, watermark-style, purple tint)

---

**Page 2 - Executive Summary:**

**Page header** (all subsequent pages):

- **Top**: Thin purple line
- **Left**: "HealthTrack App | Compliance Readiness Report"
- **Right**: "Page 2"
- **Bottom**: Thin gray line

**Section: Executive Summary**

- **Heading**: "EXECUTIVE SUMMARY" (24px, Purple #6d18ff, bold)

**Overall Status Card:**

- **Background**: Light purple (#e9ddff)
- **Layout**: Centered
- **Content**:
  - **Compliance score**:
    - Huge "72%" (72px, Purple, bold)
    - Circular gauge behind number (purple arc)
  - **Status badge**:
    - "PARTIALLY COMPLIANT" (yellow badge, 16px)
  - **Status description**:
    - "Your organization has achieved 72% compliance readiness across assessed frameworks. While significant progress has been made, critical gaps require immediate attention." (16px, Gray-800)

**Key Findings** (Bullet section):

- **Subheading**: "Key Findings" (18px, semi-bold)
- **Bullets** (with icons):
  - ✅ "82 of 120 controls have been assessed (68% completion)"
  - ✅ "52 controls are fully compliant (43%)"
  - ⚠️ "8 controls are non-compliant, including 2 critical gaps"
  - 📊 "HIPAA compliance at 72%, GDPR at 65%, PCI-DSS at 68%"
  - 🎯 "Estimated 14 days to reach 80% compliance at current pace"

**Critical Risks Identified:**

- **Subheading**: "Critical Risks" (18px, semi-bold, red accent)
- **Risk cards** (2 critical items):

  **Risk 1:**
  - **Background**: Light red tint
  - **Badge**: "CRITICAL" (red)
  - **Framework**: HIPAA badge
  - **Control**: "HIPAA-164.312(a)(2)(iv) - Encryption at Rest"
  - **Issue**: "Protected health information is not encrypted in database storage"
  - **Impact**: "High risk of data breach, HIPAA violation fines up to $1.5M"

  **Risk 2:**
  - Similar layout
  - Control: "GDPR Art. 30 - Records of Processing Activities"
  - Issue: "No documented records of data processing activities"
  - Impact: "GDPR non-compliance, potential fines up to 4% of global revenue"

**Top Recommendations:**

- **Subheading**: "Immediate Action Items" (18px, semi-bold)
- **Numbered list** (top 3):
  1. "Implement database encryption at rest for all PHI (Target: 2 weeks)"
  2. "Document and maintain processing activity records (Target: 1 week)"
  3. "Enable comprehensive audit logging across all systems (Target: 3 weeks)"

---

**Page 3 - Organization Profile:**

**Section: Organization Overview**

- **Heading**: "ORGANIZATION PROFILE" (24px, Purple)

**Details table:**
| Field | Value |
|-------|-------|
| **Product Name** | HealthTrack App |
| **Description** | A mobile application that helps users track their fitness goals, nutrition, and health metrics |
| **Services Offered** | Data analytics, personalized health recommendations, meal planning, fitness tracking |
| **Target Customers** | Individual consumers, fitness enthusiasts, health-conscious adults aged 25-55 |
| **Problem Solved** | Difficulty tracking health metrics consistently, lack of personalized nutrition guidance |

**Data Handling:**

- **Subheading**: "Data Types Processed" (16px, semi-bold)
- **Badge grid**:
  - PII (Personally Identifiable Information)
  - PHI (Protected Health Information)
  - Payment Card Data
  - Employee Data
- **Description for each** in small text

**Regions of Operation:**

- **Subheading**: "Geographic Scope" (16px, semi-bold)
- **Map visualization** (optional):
  - World map with highlighted regions
  - Purple: United States, European Union
- **List**:
  - 🇺🇸 United States
  - 🇪🇺 European Union

---

**Page 4 - Framework Scores:**

**Section: Framework Assessment Results**

- **Heading**: "FRAMEWORK COMPLIANCE SCORES" (24px, Purple)

**Framework cards** (one per framework):

**HIPAA Card:**

- **Background**: White with left purple accent
- **Layout**: Left-to-right

**Left side** (30%):

- Framework icon (medical cross)
- "HIPAA" (24px, bold)
- "Health Insurance Portability and Accountability Act"
- Region badge: "United States"
- Category badge: "Healthcare"

**Center** (30%):

- **Large score**: "72%" (48px, purple)
- **Circular progress**: 72% filled (purple ring)
- **Status**: "Partially Compliant" (yellow badge)

**Right side** (40%):

- **Control breakdown**:
  - Total controls: 50
  - ✅ Compliant: 36 (72%)
  - ⚠️ Partially: 10 (20%)
  - ❌ Non-compliant: 2 (4%)
  - ⏸️ Not started: 2 (4%)
- **Mini progress bars** for each status

**Key gaps**:

- "Critical: Encryption at rest"
- "High: Breach notification procedures"

---

**GDPR Card:**

- Similar layout
- Score: 65%
- Controls: 50 total
- Compliant: 33
- Key gaps: "Processing activity records", "Data retention policies"

---

**PCI-DSS Card:**

- Score: 68%
- Controls: 20 total
- Key gaps: "Cardholder data encryption", "Access logs"

---

**Comparison visualization:**

- **Horizontal bar chart**:
  - X-axis: 0-100%
  - Bars for each framework (color-coded)
  - Target line at 80% (dotted)
  - HIPAA: 72% (purple bar)
  - GDPR: 65% (teal bar)
  - PCI-DSS: 68% (indigo bar)

---

**Page 5 - Risk Summary:**

**Section: Risk Analysis**

- **Heading**: "RISK SUMMARY & ANALYSIS" (24px, Purple)

**Risk Distribution Chart:**

- **Pie or donut chart**:
  - Critical: 2 (red segment, 6%)
  - High: 8 (orange, 24%)
  - Medium: 15 (yellow, 44%)
  - Low: 9 (blue, 26%)
  - Total: 34 gaps
- **Legend** with counts and percentages

**Risk Heatmap:**

- **2D grid**:
  - Y-axis: Framework (HIPAA, GDPR, PCI-DSS)
  - X-axis: Severity (Critical, High, Medium, Low)
  - Cells: Color intensity by count
  - Numbers in cells
- **Title**: "Risk Distribution by Framework and Severity"

**Detailed Risk Table:**

- **Heading**: "Top 10 Priority Risks" (18px, semi-bold)
- **Table columns**:
  - Rank (#1, #2, etc.)
  - Control ID
  - Control Title (truncated)
  - Framework
  - Severity (badge)
  - Current Status
  - Estimated Impact
- **Sorted by**: Severity + Impact
- **Row highlighting**: Critical rows in light red background

**Example rows:**

1. HIPAA-164.312(a)(2)(iv) | Encryption at Rest | HIPAA | CRITICAL | Non-Compliant | High financial/reputational risk
2. GDPR Art. 30 | Processing Records | GDPR | CRITICAL | Non-Compliant | Regulatory fines up to 4% revenue
3. PCI-3.4 | Cardholder Encryption | PCI-DSS | HIGH | Partially Compliant | Payment processor penalties

---

**Page 6 - Control Status Breakdown:**

**Section: Detailed Control Assessment**

- **Heading**: "CONTROL STATUS BREAKDOWN" (24px, Purple)

**By Framework sections:**

**HIPAA - Administrative Safeguards (20 controls):**

- **Subheading** with completion: "(18/20 completed, 90%)"
- **Table**:
  - Columns: Control ID | Title | Severity | Status | Comments | Evidence
  - Rows: Each control
  - Color-coded status icons
  - Truncated comments with "..." if long
  - Evidence count badge

**Example rows:**

- ✅ HIPAA-164.308(a)(1) | Security Management | High | Compliant | "RBAC implemented..." | 2 files
- ⚠️ HIPAA-164.308(a)(3) | Workforce Security | Medium | Partial | "Background checks..." | 1 file
- ❌ HIPAA-164.312(a)(2)(iv) | Encryption | Critical | Non-Compliant | "Not implemented" | 0 files

**Repeat for**:

- HIPAA - Physical Safeguards
- HIPAA - Technical Safeguards
- GDPR - Lawfulness of Processing
- GDPR - Data Subject Rights
- PCI-DSS - Build and Maintain Secure Network
- Etc.

**Status legend** (bottom of page):

- ✅ Compliant: Control fully implemented and documented
- ⚠️ Partially Compliant: Control partially implemented, gaps exist
- ❌ Non-Compliant: Control not implemented or significant gaps
- ⏸️ Not Started: Assessment not yet completed
- N/A: Not Applicable to this organization

---

**Page 7 - Evidence Inventory:**

**Section: Evidence Documentation**

- **Heading**: "EVIDENCE INVENTORY" (24px, Purple)

**Summary stats:**

- Total evidence files: 42
- Total file size: 85.6 MB
- Most recent upload: 2 hours ago

**Evidence table** (grouped by control):

- **Columns**:
  - Control ID
  - Control Title
  - Framework
  - Evidence File Name
  - File Type
  - Upload Date
  - Uploaded By

**Example rows:**

- HIPAA-164.308(a)(1) | Security Management | HIPAA | access-control-policy.pdf | PDF | Feb 10, 2026 | Sarah Chen
- HIPAA-164.308(a)(1) | Security Management | HIPAA | rbac-implementation.docx | DOCX | Feb 11, 2026 | Mike Johnson
- GDPR Art. 5 | Principles | GDPR | data-processing-agreement.pdf | PDF | Feb 8, 2026 | Sarah Chen

**Visual indicators:**

- File type icons (PDF, DOCX, etc.)
- Recent uploads highlighted (light purple background)

---

**Page 8 - Remediation Roadmap:**

**Section: Remediation Recommendations**

- **Heading**: "REMEDIATION ROADMAP" (24px, Purple)

**Timeline visualization:**

- **Gantt chart** showing suggested remediation schedule
- **12-week timeline**
- **Color-coded bars** for each initiative:
  - Week 1-4: Implement encryption (red, critical)
  - Week 2-3: Document processing activities (red, critical)
  - Week 4-6: Enable audit logging (orange, high)
  - Week 7-8: Security training (yellow, medium)
  - Ongoing: Quarterly reviews (blue, low)

**Priority action cards:**

**For each top 10 remediation:**

- **Card layout**:
  - **Header**:
    - Priority badge (Critical/High/Medium/Low)
    - Control ID and title
    - Framework badge
  - **Effort estimate**: "40 hours"
  - **Owner**: "IT Security Team"
  - **Timeline**: "Weeks 1-4"
  - **Brief description**: 2-3 sentence summary of what needs to be done
  - **Expected impact**: "Will improve HIPAA score by ~4%"

**Summary table:**
| Priority | Count | Estimated Hours | Estimated Cost\* |
|----------|-------|-----------------|-----------------|
| Critical | 2 | 60 | $9,000 |
| High | 8 | 180 | $27,000 |
| Medium | 15 | 120 | $18,000 |
| Low | 9 | 40 | $6,000 |
| **Total** | **34** | **400** | **$60,000** |

\*Assuming $150/hour internal labor cost

---

**Page 9 - Appendices:**

**Section: Appendix A - Methodology**

- **Heading**: "APPENDIX A: ASSESSMENT METHODOLOGY" (20px, Purple)

**Content**:

- Explanation of assessment approach
- Scoring methodology:
  - Compliant = 100% (1.0 weight)
  - Partially Compliant = 50% (0.5 weight)
  - Non-Compliant = 0% (0.0 weight)
  - Not Applicable = Excluded from calculation
  - Weighted by control severity/importance
- Data collection methods
- Timeframe of assessment

**Section: Appendix B - Framework Descriptions**

- **Heading**: "APPENDIX B: FRAMEWORK DESCRIPTIONS"

**For each framework:**

- **Framework name** (16px, semi-bold)
- **Official name**
- **Governing body**
- **Purpose and scope**
- **Who it applies to**
- **Key requirements** (bullet list)
- **Penalties for non-compliance**

**Section: Appendix C - Glossary**

- **Heading**: "APPENDIX C: GLOSSARY OF TERMS"

**Alphabetical list:**

- **Compliance**: The state of adhering to regulatory requirements...
- **Control**: A safeguard or countermeasure to...
- **Framework**: A structured set of guidelines...
- **PHI**: Protected Health Information...
- **PII**: Personally Identifiable Information...
- Etc.

---

**Final Page - Footer:**

**Company information:**

- Cipherion logo
- "Powered by Cipherion AI Compliance Platform"
- Contact information
- Website: cipherion.com
- Support: support@cipherion.com

**Disclaimer:**

- "This report is generated by Cipherion's AI-powered compliance platform and is intended for informational purposes only. It does not constitute legal advice. Organizations should consult with qualified legal and compliance professionals before making decisions based on this report."

**Copyright:**

- "© 2026 Cipherion. All rights reserved. Confidential and proprietary."

---

**Interactive Features** (Web preview only):

**Floating action bar** (bottom of page):

- "Download PDF" (purple, prominent)
- "Share via email" (outlined)
- "Print" (outlined)
- "Schedule automated reports" (link)

**Table of contents sidebar** (left, collapsible):

- Clickable links to each section
- Current section highlighted in purple
- Smooth scroll to section on click

**Interactive charts:**

- Hover to see exact values
- Click to filter/drill down
- Expandable for full-screen view

**Annotations** (admin/user):

- Ability to add notes to specific sections (comment icon)
- "Add note" button appears on hover
- Notes saved separately, visible in web view

**Export options:**

- PDF (formatted for print)
- Word (editable)
- Excel (data tables only)
- PowerPoint (summary slides)

**Sharing options:**

- Generate shareable link (with expiration, password protection)
- Email directly (with customizable message)
- Integrate with Google Drive/Dropbox

---

**Visual Design Guidelines:**

**Typography:**

- Headings: Inter Bold
- Body: Inter Regular
- Mono font for control IDs: "Roboto Mono"

**Colors:**

- Headings: Purple #6d18ff
- Body text: Gray-900 (#171717)
- Secondary text: Gray-600 (#525252)
- Accents: Purple throughout
- Semantic colors for status (green/yellow/red/gray)

**Spacing:**

- Generous margins (1 inch equivalent in web)
- Section breaks: 48px
- Card padding: 24px
- Line height: 1.6 for readability

**Charts and Graphs:**

- Use brand purple as primary color
- Professional, clean styling
- Data labels clearly visible
- Legends with clear iconography

**Page layout:**

- Mimic printed document
- Clean, professional aesthetic
- Print-friendly CSS
- Page breaks at logical sections (for PDF)

**Branding:**

- Cipherion logo on cover and footer
- Purple accent color throughout
- Professional, trustworthy appearance
- Enterprise-grade design quality

---
