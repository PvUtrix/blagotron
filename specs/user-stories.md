# User Stories & Use Cases

## Personas

### Primary Personas

#### 1. Maya - The Overwhelmed Professional
**Demographics**: 28, Software Engineer, Single, Urban
**Goals**: Better work-life balance, develop hobbies, improve health
**Pain Points**: Feels always busy but not fulfilled, neglects relationships, burnout risk
**Tech Savvy**: High
**Quote**: "I'm productive at work but my personal life is falling apart. I need to figure out what actually matters to me."

#### 2. Alex - The Career Transitioner
**Demographics**: 35, Marketing Manager considering career change, Married, 1 child
**Goals**: Explore new career paths, learn new skills, maintain income while transitioning
**Pain Points**: Unclear about options, limited time for exploration, financial concerns
**Tech Savvy**: Medium
**Quote**: "I want to do something more meaningful but I don't even know where to start or what's possible."

#### 3. Jordan - The Recent Graduate
**Demographics**: 23, Recent college graduate, Entry-level analyst, Lives with roommates
**Goals**: Build good life habits early, explore interests, build network
**Pain Points**: Student habits (irregular sleep, poor nutrition), social media addiction, comparison with peers
**Tech Savvy**: High
**Quote**: "I know I should be building better habits and figuring out what I want, but it's hard to stay motivated."

#### 4. Sam - The Busy Parent
**Demographics**: 42, Consultant and parent of 3 (ages 6, 9, 12), Married
**Goals**: Stay healthy, advance career, be present for family, maintain relationship with spouse
**Pain Points**: No personal time, constant firefighting, guilt about self-care
**Tech Savvy**: Medium
**Quote**: "Everyone needs something from me all the time. I've completely lost track of who I am outside of work and parenting."

#### 5. Riley - The Purpose Seeker
**Demographics**: 52, Mid-career in finance, Empty nester
**Goals**: Find more meaningful work, give back to community, prepare for next life chapter
**Pain Points**: Feels unfulfilled despite success, wondering "is this all there is?", fear of irrelevance
**Tech Savvy**: Medium-Low
**Quote**: "I've been successful by traditional measures, but I want the second half of my life to be about more than money."

### Secondary Personas

#### 6. Chris - The Student
**Demographics**: 19, University student
**Goals**: Academic success, skill development, career prep, social life
**Pain Points**: Procrastination, unclear career direction, stress management

#### 7. Taylor - The Creative Professional
**Demographics**: 30, Freelance designer
**Goals**: Consistent income, creative fulfillment, avoid burnout, build sustainable business
**Pain Points**: Feast-or-famine cycle, isolation, difficulty with self-discipline

## User Stories

### Discovery & Onboarding

#### US-001: Initial Self-Assessment
**As** a new user
**I want** to complete an initial life assessment
**So that** I can understand my current state and what I want to improve

**Acceptance Criteria**:
- Complete life balance wheel for 8 domains
- Answer 3-5 key questions about values and priorities
- Receive personalized insights based on responses
- Takes less than 10 minutes
- Can skip and do later
- Data saved and editable

**Priority**: P0 (MVP)

#### US-002: Platform Tour
**As** a new user
**I want** to see examples of how the platform works
**So that** I can understand how it will help me

**Acceptance Criteria**:
- Interactive walkthrough of key features
- Example data populated for demonstration
- Option to skip or replay
- Mobile and web optimized

**Priority**: P1

### Goal Setting & Planning

#### US-003: Set Life Goals
**As** Maya
**I want** to set goals across different areas of my life
**So that** I can work toward a more balanced life

**Acceptance Criteria**:
- Create goals for each life domain
- Define short, medium, and long-term goals
- See goals organized by timeline and domain
- Edit and archive goals
- Link goals to specific activities

**Priority**: P0 (MVP)

#### US-004: Explore Career Options
**As** Alex
**I want** to explore different career paths and required skills
**So that** I can make an informed decision about my transition

**Acceptance Criteria**:
- Browse career database with filters
- See required skills and typical salaries
- View learning paths for each career
- Save interesting options for later
- Connect with people in those fields

**Priority**: P2

#### US-005: Build Weekly Plan
**As** Sam
**I want** to plan my week based on my energy and commitments
**So that** I can fit in what's important without overwhelming myself

**Acceptance Criteria**:
- See calendar view of week
- Input current energy level and context
- Get activity suggestions based on available time slots
- Drag and drop activities to schedule
- Save as template for future weeks
- Sync with external calendar

**Priority**: P1

### Tracking & Logging

#### US-006: Quick Activity Log
**As** any user
**I want** to quickly log activities via Telegram
**So that** I can track without interrupting my day

**Acceptance Criteria**:
- Send simple text message to bot
- Natural language parsing (e.g., "30 min run +2 energy")
- Voice note support for reflections
- Photo logging with automatic categorization
- Confirmation and correction flow
- Works offline, syncs when connected

**Priority**: P0 (MVP)

#### US-007: Track Energy Patterns
**As** Maya
**I want** to see when I have most/least energy
**So that** I can schedule important tasks optimally

**Acceptance Criteria**:
- Log energy level multiple times per day
- View energy patterns by time of day, day of week
- See correlations with activities and sleep
- Get scheduling recommendations
- Export data for external analysis

**Priority**: P1

#### US-008: Monitor Life Balance
**As** Sam
**I want** to regularly assess my life balance
**So that** I can catch imbalances before they become problems

**Acceptance Criteria**:
- Monthly prompted life balance check-in
- Visual comparison to previous assessments
- Alerts for significant drops in any domain
- Suggestions for rebalancing
- Historical trend view

**Priority**: P1

### Reflection & Learning

#### US-009: Daily Reflection
**As** Jordan
**I want** to reflect on my day with guided questions
**So that** I can develop self-awareness and learn from experiences

**Acceptance Criteria**:
- Receive daily reflection prompt (customizable time)
- Rotating questions from question bank
- Free-form journaling option
- Tag reflections for later search
- Review past reflections
- Streak counter for motivation

**Priority**: P0 (MVP)

#### US-010: Learn from Research
**As** Riley
**I want** to learn about evidence-based practices for well-being
**So that** I can make informed decisions about how to spend my time

**Acceptance Criteria**:
- Browse curated research summaries by topic
- See actionable takeaways
- Source citations for credibility
- Bookmark interesting articles
- Get personalized recommendations based on goals
- Weekly newsletter with new findings

**Priority**: P2

#### US-011: Discover Activity Ideas
**As** Sam
**I want** to find meaningful activities I can do in 5-20 minutes
**So that** I can make use of small pockets of free time

**Acceptance Criteria**:
- Filter activities by time available, domain, energy level
- See activities I haven't tried recently
- Mark activities as tried with rating
- Get recommendations based on preferences
- Contribute my own activity ideas
- Download list for offline reference

**Priority**: P1

### Insights & Analytics

#### US-012: View Personal Dashboard
**As** any user
**I want** to see an at-a-glance view of my life metrics
**So that** I can stay aware of my progress and patterns

**Acceptance Criteria**:
- Customizable widget-based dashboard
- Life balance wheel, goal progress, streaks, energy patterns
- Quick action buttons
- Refresh on demand
- Mobile optimized
- Offline capable (shows cached data)

**Priority**: P1

#### US-013: Receive Weekly Insights
**As** Maya
**I want** to get a weekly summary of patterns and insights
**So that** I can understand what's working and what's not

**Acceptance Criteria**:
- Automated weekly email/notification
- Key metrics: activities logged, energy patterns, goal progress
- Insights: what increased/decreased well-being
- Suggestions for upcoming week
- Comparison to previous weeks
- Shareable (opt-in)

**Priority**: P2

#### US-014: Identify Patterns
**As** Alex
**I want** the system to identify patterns in my activities and well-being
**So that** I can make data-informed decisions

**Acceptance Criteria**:
- Automatic pattern detection (e.g., "Running in morning correlated with +15% productivity")
- Correlations between activities and outcomes
- Warning signs (burnout risk, declining balance)
- Confidence intervals shown
- Export data for external analysis
- Privacy-preserving (patterns stay local or anonymized)

**Priority**: P2

### Community & Social

#### US-015: Find Accountability Partner
**As** Jordan
**I want** to find someone with similar goals to keep each other accountable
**So that** I'm more likely to follow through on commitments

**Acceptance Criteria**:
- Matching based on goals and preferences
- Request/accept partnership flow
- Shared check-in schedule
- Encouraging messages
- Privacy controls
- End partnership easily

**Priority**: P2

#### US-016: Join Learning Group
**As** Alex
**I want** to join a group of people learning similar skills
**So that** we can support and learn from each other

**Acceptance Criteria**:
- Browse groups by topic
- See member count and activity level
- Join group (with approval if private)
- Group discussions and resource sharing
- Group challenges and milestones
- Leave group easily

**Priority**: P3

#### US-017: Share Routine
**As** Riley
**I want** to share my daily routine anonymously
**So that** others can learn from my experience

**Acceptance Criteria**:
- Create routine template from my schedule
- Add commentary on what works and why
- Publish anonymously or with attribution
- Tag by profession, life stage, goals
- Receive feedback and questions
- Edit or remove at any time

**Priority**: P3

### Integrations

#### US-018: Sync with Wearable
**As** Maya
**I want** to import sleep and activity data from my smartwatch
**So that** I don't have to manually track everything

**Acceptance Criteria**:
- Connect Apple Watch, Fitbit, or Garmin
- OAuth or API key authentication
- Import sleep, steps, heart rate, workouts
- Automatic daily sync
- View wearable data in dashboard
- Disconnect integration easily

**Priority**: P2

#### US-019: Sync with Calendar
**As** Sam
**I want** to sync with my Google Calendar
**So that** the platform understands my commitments

**Acceptance Criteria**:
- Connect Google/Apple/Outlook calendar
- Two-way sync (optional)
- View calendar events in planning view
- Automatic busy time detection
- Activity suggestions in free slots
- Privacy: don't send data back to calendar unless user chooses

**Priority**: P2

#### US-020: Export All Data
**As** any user
**I want** to export all my data
**So that** I own my information and can use it elsewhere

**Acceptance Criteria**:
- One-click export to JSON/CSV
- Includes all activities, reflections, goals, snapshots
- Human-readable format
- Downloadable within 24 hours
- Can schedule recurring exports
- GDPR compliant

**Priority**: P1

## Use Cases

### Use Case 1: First-Time User Onboarding

**Actor**: New user (Maya)
**Preconditions**: User has created account
**Flow**:
1. User lands on welcome screen
2. System presents option: "Quick start" or "Take tour"
3. User chooses "Quick start"
4. System asks user to rate current satisfaction in 8 life domains (0-10 scale)
5. User completes life balance wheel (2 minutes)
6. System shows visual wheel with current state
7. System asks: "What would you most like to improve?"
8. User selects 2-3 domains
9. System suggests starter goals for those domains
10. User selects or modifies goals
11. System asks: "How do you want to use Blagotron?"
    - Daily reflection
    - Activity tracking
    - Goal planning
    - All of the above
12. User makes selection
13. System shows personalized dashboard
14. System offers: "Try logging your first activity?" or "Explore more features?"
15. User begins using platform

**Postconditions**: User has baseline assessment, initial goals, and understands core functionality

**Alternative Flows**:
- A1: User chooses "Take tour" → Interactive demo with sample data
- A2: User skips onboarding → Goes straight to empty dashboard with help hints

**Priority**: P0 (MVP)

### Use Case 2: Morning Planning Routine

**Actor**: Sam (busy parent)
**Preconditions**: User has been using platform for 2+ weeks
**Flow**:
1. User wakes up, checks Telegram
2. Bot sends: "Good morning! How's your energy today? (1-5)"
3. User replies: "3 - okay but a bit tired"
4. Bot: "You have 2 hours of focus time this morning before meetings. Here are some suggestions:"
   - Work on Q3 strategy doc (aligns with career goal)
   - 20 min exercise (you've missed last 3 days)
   - Review son's school project (family)
5. User: "Exercise"
6. Bot: "Great! What type? I'll set a timer."
7. User: "Yoga"
8. Bot: "20 min yoga timer started. I'll check in after. 🧘"
9. [20 minutes pass]
10. Bot: "How was your yoga session? Energy level now? (1-5)"
11. User: "Good! Energy 4"
12. Bot logs: 20 min yoga, energy +1
13. Bot: "Awesome! That puts you at 3 yoga sessions this week. 🎯 Ready to tackle that strategy doc now?"

**Postconditions**: User has logged activity, made progress on goal, received positive reinforcement

**Alternative Flows**:
- A1: User reports low energy → Bot suggests rest/recovery activities
- A2: User is too busy → Bot says "No problem, check in later when you have time"

**Priority**: P1

### Use Case 3: Career Exploration

**Actor**: Alex (career transitioner)
**Preconditions**: User has indicated interest in career change
**Flow**:
1. User opens web app, goes to "Explore Careers"
2. System shows career exploration wizard:
   - "What matters most to you?" (values ranking)
   - "What are you naturally good at?" (skills checklist)
   - "What industries interest you?" (multi-select)
3. User completes assessment (5 minutes)
4. System shows 10 career matches with scores
5. User clicks on "UX Designer" (75% match)
6. System shows:
   - Description of role
   - Typical day-in-the-life
   - Required skills (highlighting Alex's existing skills in green)
   - Skills to develop (with learning paths)
   - Salary ranges
   - Job market outlook
   - Transition stories from people with similar backgrounds
7. User clicks "Learning Path"
8. System shows structured path:
   - Phase 1: Foundations (3 months) - 4 online courses
   - Phase 2: Practice (3 months) - Build portfolio projects
   - Phase 3: Networking (2 months) - Join communities, attend events
   - Phase 4: Job search (2+ months)
9. User clicks "Start Learning Path"
10. System creates goals and milestones automatically
11. System suggests: "Connect with 3 UX designers on the platform to learn from their experience?"
12. User accepts
13. System shows potential mentors/peers
14. User sends connection requests

**Postconditions**: User has clear learning path, goals created, connections initiated

**Alternative Flows**:
- A1: User unsure about choice → Save for later, explore more options
- A2: User wants custom path → Manually select courses and create own milestones

**Priority**: P2

### Use Case 4: Burnout Detection & Recovery

**Actor**: Maya (overwhelmed professional)
**Preconditions**: User has been tracking for 4+ weeks
**Flow**:
1. System detects pattern:
   - Life balance wheel scores declining in 3+ domains over 4 weeks
   - Energy levels consistently low
   - Negative sentiment in reflections
   - Decreased activity logging (sign of disengagement)
2. System generates insight: "Burnout risk detected"
3. System sends notification: "Hey Maya, I've noticed some concerning patterns. Mind if we check in?"
4. User opens app
5. System shows dashboard with highlighted concerns:
   - Health score: 8 → 4
   - Relationships: 7 → 4
   - Recreation: 6 → 2
   - Average energy: 6 → 3.5
6. System: "It looks like you might be burning out. This is serious but totally recoverable. Want help creating a recovery plan?"
7. User: "Yes"
8. System presents recovery framework:
   - Immediate (this week):
     - Book one day off (no exceptions)
     - 30 min nature walk daily
     - 8+ hours sleep nightly
   - Short-term (next 2 weeks):
     - Set boundaries on work hours
     - Reconnect with 2 friends
     - Resume one hobby
   - Medium-term (next month):
     - Evaluate workload with manager
     - Start regular exercise routine
     - Weekly self-care activities
9. System: "Can you commit to the immediate actions this week?"
10. User selects which ones they can do
11. System creates daily check-ins and reminders
12. System suggests: "Want to connect with someone who's recovered from burnout?"
13. User accepts
14. System connects user with peer mentor

**Postconditions**: User has recovery plan, support system activated, daily monitoring enabled

**Alternative Flows**:
- A1: User dismisses concerns → System respects choice but checks in again in 1 week
- A2: User marks as false alarm → System adjusts detection algorithm

**Priority**: P2 (Important for user well-being)

### Use Case 5: Weekly Review & Planning

**Actor**: Riley (purpose seeker)
**Preconditions**: User has been using platform for 2+ months, Sunday evening
**Flow**:
1. User receives notification: "Time for your weekly review"
2. User opens web app to Weekly Review page
3. System shows past week summary:
   - Activities logged: 42
   - Goals progressed: 3 of 5
   - Energy average: 6.5 (up from 6.1)
   - Highlights:
     - Volunteered at food bank (aligns with contribution goal)
     - Finished online course module
     - Had lunch with old colleague
   - Challenges:
     - Skipped exercise 4 days
     - Didn't work on side project
4. System prompts reflection questions:
   - "What gave you the most energy this week?"
   - "What would you do differently?"
   - "What are you grateful for?"
5. User answers questions (free-form text)
6. System analyzes responses and shows insights:
   - "You mentioned 'meaningful conversation' 3 times - relationships are energizing for you"
   - "Exercise correlation with better mood is strong - prioritize this?"
7. System: "Ready to plan next week?"
8. User: "Yes"
9. System shows blank week template with:
   - Fixed commitments from calendar
   - Suggested activities based on goals and patterns
   - Open slots for user to fill
10. User drags in activities:
    - Morning walks 3x
    - Volunteer Tuesday evening
    - Coffee with mentor Thursday
    - Side project 2-hour blocks Saturday
11. System: "This plan supports 4 of your 5 active goals. Looks balanced!"
12. User saves plan
13. System: "I'll check in Monday morning to see how you want to start the week. Have a great Sunday evening!"

**Postconditions**: User has reflected on past week, planned next week, gained insights

**Alternative Flows**:
- A1: User skips review → System sends gentle reminder but doesn't nag
- A2: User wants to adjust goals → Option to modify goals during review

**Priority**: P1

## Edge Cases & Error Scenarios

### EC-001: User Logs Conflicting Data
**Scenario**: User logs energy as +3 but writes reflection saying "terrible day"
**Handling**:
- Flag for user attention: "You rated high energy but reflection sounds tough - want to adjust?"
- Learn user's language patterns over time
- Don't override user input

### EC-002: Integration Fails to Sync
**Scenario**: Wearable sync fails due to API error
**Handling**:
- Retry automatically 3 times with backoff
- Show user-friendly message: "Couldn't sync with [device]. We'll keep trying."
- Allow manual trigger of sync
- Log error for debugging

### EC-003: User Abandons Platform
**Scenario**: User stops logging after 2 weeks
**Handling**:
- Send gentle check-in after 3 days: "Hey, haven't seen you around. Everything okay?"
- After 1 week: "We're here when you're ready. No pressure."
- After 1 month: "Want to export your data before you go?"
- Don't spam or guilt-trip

### EC-004: Harmful Content Detection
**Scenario**: User's reflection contains concerning language (self-harm, severe depression)
**Handling**:
- Show crisis resources immediately
- Suggest professional help
- Do not try to "coach" through serious mental health issues
- Clearly state limitations: "I'm not a therapist"

### EC-005: Data Loss
**Scenario**: User accidentally deletes important data
**Handling**:
- 30-day soft delete (recoverable)
- Prominent "Undo" option
- Regular auto-backups
- Export reminder before major deletions

## Success Metrics per Story

### Engagement Metrics
- **US-001 (Onboarding)**: 70%+ completion rate
- **US-006 (Quick Log)**: Average 3+ logs per day for active users
- **US-009 (Reflection)**: 50%+ users reflect at least weekly

### Outcome Metrics
- **US-003 (Goals)**: 60%+ of set goals marked as progressed or completed within timeframe
- **US-008 (Life Balance)**: Average life balance score improvement of 1+ point per domain over 3 months
- **US-013 (Insights)**: 40%+ of insight recommendations acted upon

### Satisfaction Metrics
- **US-018 (Integrations)**: 80%+ successfully connect on first try
- **US-020 (Export)**: 95%+ successful exports within 24 hours
- **Overall**: NPS score of 40+ among active users (3+ months)

---

*These user stories will evolve based on user research and testing. Prioritize stories that serve core user needs and align with constitution values.*
