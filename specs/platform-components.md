# Platform Components Breakdown

## Overview

Blagotron consists of three main client platforms, all connected to a unified backend API. Each platform is optimized for its context while maintaining feature parity where appropriate.

## 1. Web Application

### Purpose
Primary full-featured interface for deep work, planning, and analysis.

### Target Devices
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablet browsers
- Mobile browsers (responsive)

### Key Features

#### Core Functionality
- **Dashboard**: Customizable widget-based home screen
- **Life Balance Wheel**: Interactive visualization with history
- **Goal Management**: Full CRUD with progress tracking
- **Activity Browser**: Searchable, filterable history
- **Calendar View**: Week/month views with drag-and-drop
- **Analytics**: Rich charts and pattern visualizations
- **Reflection Journal**: Full-text search, tagging, calendar view

#### Advanced Features
- **Weekly Review**: Structured review and planning workflow
- **Career Explorer**: Browse careers, skills, learning paths
- **Content Library**: Research articles, routines, activity ideas
- **Community**: Profile, connections, groups, messaging
- **Settings**: Comprehensive configuration and integrations
- **Data Export**: One-click export and backup

### Technology Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui components
- **State**: Zustand
- **Data**: React Query (TanStack Query)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **PWA**: Offline capability with Service Workers

### User Experience Principles
- **Information Dense**: Make use of screen real estate
- **Keyboard Shortcuts**: Power users can navigate quickly
- **Multi-Panel**: Side-by-side views for context
- **Responsive**: Works on tablets and phones too
- **Fast**: Code splitting, lazy loading, optimized builds

### Navigation Structure
```
/
  ├── /dashboard
  ├── /goals
  │   ├── /new
  │   └── /[id]
  ├── /activities
  │   ├── /log
  │   └── /patterns
  ├── /reflections
  │   ├── /new
  │   └── /[id]
  ├── /planning
  │   ├── /week
  │   └── /month
  ├── /insights
  ├── /explore
  │   ├── /careers
  │   ├── /skills
  │   ├── /activities
  │   └── /research
  ├── /community
  │   ├── /connections
  │   ├── /groups
  │   └── /profile
  └── /settings
      ├── /profile
      ├── /integrations
      ├── /notifications
      └── /data
```

### Offline Capabilities
- Read-only access to cached data
- Queue writes for sync when online
- Clear indication of offline status
- Background sync when connection restored

### Performance Targets
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 90+
- **Bundle Size**: < 200KB initial (gzipped)

## 2. Telegram Bot

### Purpose
Quick, low-friction logging and check-ins via conversational interface.

### Target Users
- Users who want logging without opening an app
- Users who prefer text/voice over GUI
- Users in low-bandwidth or mobile-first contexts
- Users who live in Telegram already

### Key Features

#### Core Commands
- `/start` - Welcome and quick setup
- `/log [activity]` - Quick activity log
  - Example: `/log 30 min run +2 energy`
  - Example: `/log finished project proposal`
- `/energy [1-5]` - Quick energy check
- `/balance` - Show current life balance wheel
- `/goals` - List active goals and progress
- `/reflect` - Start reflection with prompt
- `/help` - Show all commands

#### Natural Language Processing
- Parse freeform activity descriptions
- Extract duration, activity type, energy level
- Recognize common activities and abbreviations
- Multi-language support (EN, RU initially)

#### Voice & Media Support
- **Voice Notes**: Transcribe and log as reflection
- **Photos**: Log activities with images (meals, workouts, moments)
- **Location**: Optional location tagging

#### Proactive Features
- **Daily Check-ins**: "How's your energy today?"
- **Goal Reminders**: "Work on Spanish learning today?"
- **Reflection Prompts**: "Time for your evening reflection"
- **Weekly Summary**: Stats and insights
- **Encouragement**: Celebrate streaks and milestones

#### Smart Responses
```
User: "I feel exhausted"
Bot: "That's tough. What drained your energy today? I can help you track patterns."

User: "Finished my first 5K!"
Bot: "That's amazing! 🎉 How did it feel? I'll log this as a big win for your fitness goal."

User: "I don't know what to do with my afternoon"
Bot: "You have 2 hours free. Based on your goals:
     - Work on coding project (career)
     - Call a friend (relationships)
     - Go for a walk (health)

     What sounds good?"
```

### Technology Stack
- **Framework**: Node.js with Telegraf or Grammy
- **Language**: TypeScript
- **Database**: Prisma ORM
- **NLP**: Basic pattern matching initially, OpenAI/Claude API for advanced
- **Queue**: Bull for scheduled messages
- **Storage**: Redis for session state

### User Experience Principles
- **Conversational**: Feels like chatting with a friend
- **Forgiving**: Understands typos and variations
- **Concise**: Short, scannable responses
- **Helpful**: Suggests without nagging
- **Respectful**: Responds to user tone and context

### Bot Personality
- **Tone**: Warm, supportive, encouraging but not overly enthusiastic
- **Vocabulary**: Simple, clear, occasionally playful
- **Boundaries**: Acknowledges limitations, suggests web app for complex tasks
- **Cultural**: Adapts to user's communication style

### Command Flow Examples

#### First-Time User
```
User: /start
Bot: Hey there! I'm Blagotron, your life design assistant. 👋
     I can help you track activities, set goals, and design a more
     fulfilling life.

     Let's start simple: How would you rate your life satisfaction
     today? (1-10)

User: 6
Bot: Thanks for sharing. What's one thing you'd like to improve?
     - Career
     - Health
     - Relationships
     - Personal Growth
     - Other

User: Health
Bot: Great choice! I can help you track exercise, energy, sleep,
     and more. Want to set a health goal?

User: Yes
Bot: What's your health goal? (E.g., "Exercise 3x per week" or
     "Sleep 8 hours nightly")

User: Run 3 times a week
Bot: Awesome goal! I'll help you track that. Next time you run,
     just send me:
     "/log 30 min run" or even just "ran today"

     I'll check in with you throughout the week. Ready to get
     started?
```

#### Daily Usage
```
[Morning - 8 AM]
Bot: Good morning! ☀️ How's your energy? (1-5 or skip)

User: 4
Bot: Nice! You have a light meeting day according to your calendar.
     Good day to tackle your project work?

[Evening - 8 PM]
Bot: How was your day? Quick reflection:
     What gave you energy today?

User: [voice note: "Had a great conversation with my colleague
      about the new project, felt really engaged and creative"]
Bot: Love it! Sounds like collaborative work energizes you. I'll
     note that. Did you make progress on your goals today?

User: Yes, went for a run
Bot: Excellent! That's 2/3 runs this week. 🏃
     How'd it feel?

User: Great, +2 energy
Bot: Logged! Your streak is 4 days of logging. Keep it up!
```

### Integration with Web & Mini App
- Deep links to web app for complex features
- Inline buttons to launch mini app
- Seamless data sync across platforms
- Consistent terminology and mental models

### Privacy & Security
- End-to-end encryption for sensitive reflections
- User controls what bot remembers
- Clear data retention policies
- Easy disconnect/delete

### Performance Targets
- **Response Time**: < 1 second for simple commands
- **Uptime**: 99.9%
- **Message Delivery**: 99.5%

## 3. Telegram Mini App

### Purpose
Rich mobile experience within Telegram, combining GUI with conversational context.

### Target Users
- Mobile-first users
- Users who want GUI but within Telegram
- Users in markets where Telegram is dominant
- Users who want offline mobile access

### Key Features

#### Dashboard
- Life balance wheel (touch to edit)
- Goal progress cards
- Recent activities timeline
- Quick action buttons

#### Activity Logging
- Form-based quick log
- Activity type selector
- Energy slider
- Photo attachment
- Voice note

#### Goal Management
- List view with progress bars
- Swipe actions (complete, edit, delete)
- Create new goals with templates

#### Calendar View
- Week view optimized for mobile
- Tap to add activities
- Color-coded by life domain
- Sync with external calendars

#### Reflection
- Prompted questions
- Rich text editor
- Mood selector
- Tag suggestions

#### Insights
- Scrollable charts
- Energy patterns
- Goal progress
- Achievements and streaks

### Technology Stack
- **Framework**: React with Telegram Mini Apps SDK
- **Language**: TypeScript
- **UI**: Custom responsive components
- **State**: Zustand + IndexedDB for offline
- **Build**: Vite
- **Hosting**: CDN (Vercel/Netlify)

### User Experience Principles
- **Touch-First**: Large tap targets, swipe gestures
- **Native Feel**: Follows Telegram design patterns
- **Fast**: Instant perceived performance
- **Offline**: Core features work without connection
- **Lightweight**: Small bundle, fast load

### Design Patterns
- **Bottom Navigation**: 5 main tabs
- **Floating Action Button**: Quick log
- **Pull to Refresh**: Update data
- **Swipe Gestures**: Common actions
- **Modal Sheets**: Details and forms
- **Haptic Feedback**: Confirm actions

### Navigation Structure
```
Bottom Tabs:
├── Home (Dashboard)
├── Goals
├── Log (FAB)
├── Insights
└── More (Settings, Profile, etc.)
```

### Telegram Mini App Features
- **Share Button**: Share achievements to chat
- **Back Button**: Native Telegram back handling
- **Theme**: Follows Telegram theme (light/dark)
- **Viewport**: Expands to full screen when needed
- **Close**: Returns to chat seamlessly

### Offline Capabilities
- All read operations work offline
- Queue writes with visual indicator
- Background sync when online
- Conflict resolution for simultaneous edits

### Performance Targets
- **Load Time**: < 2 seconds on 3G
- **Bundle Size**: < 150KB (gzipped)
- **60 FPS**: Smooth animations
- **Battery**: Minimal background drain

## Cross-Platform Considerations

### Data Sync
- **Real-time**: Changes reflect immediately across platforms
- **Conflict Resolution**: Last-write-wins with user notification
- **Offline Queue**: Platform-specific queues sync when online
- **Consistency**: Eventually consistent with strong constraints

### Feature Parity Matrix

| Feature | Web | Bot | Mini App |
|---------|-----|-----|----------|
| View Dashboard | ✅ Full | ⚠️ Text | ✅ Full |
| Life Balance Wheel | ✅ Interactive | ⚠️ Text | ✅ Interactive |
| Set Goals | ✅ Full Form | ⚠️ Text | ✅ Simplified |
| Log Activities | ✅ Full Form | ✅ Natural Language | ✅ Form |
| View Activity History | ✅ Advanced | ⚠️ Limited | ✅ List |
| Reflections | ✅ Full Editor | ✅ Voice/Text | ✅ Simplified |
| Insights & Analytics | ✅ Advanced Charts | ⚠️ Text Summary | ✅ Basic Charts |
| Weekly Review | ✅ Full | ❌ Link to Web | ⚠️ Simplified |
| Career Explorer | ✅ Full | ❌ Link to Web | ⚠️ Browsing |
| Community | ✅ Full | ⚠️ Basics | ✅ Core |
| Settings | ✅ Full | ⚠️ Basic | ✅ Essential |
| Integrations | ✅ Full Setup | ❌ Link to Web | ⚠️ View Only |
| Data Export | ✅ Full | ❌ Link to Web | ⚠️ Request |

**Legend**: ✅ Full support, ⚠️ Limited/Simplified, ❌ Not supported (redirect)

### Design Consistency
- **Terminology**: Same words for same concepts
- **Icons**: Consistent icon set across platforms
- **Colors**: Brand colors and life domain colors
- **Tone**: Same supportive, encouraging voice
- **Flows**: Similar multi-step processes

### Deep Linking
- Universal links from bot to web/mini app
- State preservation across platforms
- Smart routing based on user context

### Authentication
- **Web**: Email/password or OAuth
- **Bot**: Telegram authentication
- **Mini App**: Inherits from Telegram
- **Account Linking**: Connect Telegram to web account

## Platform-Specific Optimizations

### Web
- **Keyboard Shortcuts**: Power user efficiency
- **Multi-Tab Support**: Open multiple views
- **Browser Extensions**: Future consideration
- **Desktop Notifications**: Web Push API

### Bot
- **Push Notifications**: Via Telegram
- **Quick Replies**: Keyboard buttons for common actions
- **Inline Mode**: Share content in other chats
- **Bot Commands**: In chat /commands for discovery

### Mini App
- **Gestures**: Swipe, long-press for actions
- **Haptics**: Vibration feedback
- **Camera**: Quick photo capture
- **Biometrics**: FaceID/Fingerprint for sensitive data

## Platform Selection Guidance

### Recommend Web for:
- Initial setup and comprehensive configuration
- Deep analysis and pattern exploration
- Weekly reviews and planning sessions
- Career exploration and learning path setup
- Community engagement (messaging, groups)
- Managing integrations
- Exporting data

### Recommend Bot for:
- Quick daily logging
- On-the-go reflections
- Daily check-ins
- Reminders and nudges
- Voice journaling
- Lowest-friction interaction

### Recommend Mini App for:
- Mobile-first users who want GUI
- Quick dashboard checks
- Touch-based goal and activity management
- Calendar planning on mobile
- Offline mobile access
- Telegram-native experience

## Development Strategy

### Phase 1: MVP
1. **Web App**: Core features (dashboard, goals, activities, reflections)
2. **Bot**: Basic logging and commands
3. **Backend API**: Essential services

### Phase 2: Enhancement
1. **Web App**: Analytics, insights, weekly review
2. **Bot**: Natural language, proactive features
3. **Mini App**: Initial release with core features

### Phase 3: Growth
1. **Web App**: Community features, career explorer
2. **Bot**: Voice, photos, advanced NLP
3. **Mini App**: Feature parity with web where appropriate
4. **Integrations**: Wearables, calendars, productivity tools

### Phase 4: Optimization
1. All platforms: Performance optimization
2. Advanced features: AI recommendations, pattern prediction
3. Enterprise features: Team accounts, admin tools

## Quality Assurance

### Testing Strategy
- **Unit Tests**: 80%+ coverage for business logic
- **Integration Tests**: API contracts, data flows
- **E2E Tests**: Critical user journeys per platform
- **Cross-Platform Tests**: Data sync, consistency
- **Performance Tests**: Load testing, stress testing
- **Usability Tests**: User research sessions

### Browser/Device Matrix
- **Web**: Last 2 versions of Chrome, Firefox, Safari, Edge
- **Bot**: Telegram iOS and Android clients
- **Mini App**: Telegram iOS 8.0+, Android 8.0+

### Accessibility
- **Web**: WCAG 2.1 AA compliance
- **Bot**: Screen reader friendly messages
- **Mini App**: Semantic HTML, ARIA labels, keyboard nav

## Monitoring & Analytics

### Platform Usage
- Active users per platform
- Platform preference patterns
- Feature usage heatmaps
- User journey flows

### Performance Monitoring
- Load times, error rates per platform
- API response times
- Offline queue sizes
- Sync failures

### User Feedback
- In-app feedback forms (web, mini app)
- Bot conversation ratings
- Support ticket categorization
- Feature requests voting

---

*Each platform serves specific user contexts. Success means seamless experience across all three, with users naturally choosing the right tool for each task.*
