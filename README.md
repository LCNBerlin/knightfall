# Knightfall - High-Stakes Chess Wagering

A cinematic, high-stakes chess wagering app with social features, teams, and tournaments.

## ⚡ Local Development (Frontend + Backend)

Follow these steps to run the full stack locally (frontend on 3000, backend on 3001):

1) Start database services (from the backend folder):
```bash
cd /Users/berlin/Desktop/Chess/knightfall-backend
docker compose up -d
```

2) Prepare backend env and dependencies:
```bash
cd /Users/berlin/Desktop/Chess/knightfall-backend
cp -n env.example .env || true
npm install
npm run dev
```

3) Start the frontend (in another terminal):
```bash
cd /Users/berlin/Desktop/Chess/knightfall
npm install
npm run dev
```

4) Open the app:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

Troubleshooting:
- If the backend logs show database connection errors, ensure Docker is running and step (1) succeeded: `docker ps` should list the Postgres container.
- If ports are in use, stop other services or change `PORT` in `knightfall-backend/.env` and restart.

## 🎯 Vision

Knightfall combines the strategic depth of chess with the excitement of competitive wagering, creating a premium gaming experience with:

- **Dual Economy**: Token-based casual play and cash-based high-stakes matches
- **Social Features**: Teams, spectator betting, and content sharing
- **Multiple Game Modes**: Ladder matches, puzzle challenges, and battle royales
- **Anti-Cheat**: Advanced detection systems for fair play
- **Premium UI**: Dark luxury aesthetic with gold and emerald accents

## 🚀 Features (MVP)

### Core Gameplay
- **Ladder Matches**: Elo-based matchmaking with player-selectable wagers
- **Puzzle Ladder**: Curated and procedurally generated chess puzzles
- **Battle Royale**: Multiple elimination formats with knockout brackets
- **Real-time Chess Engine**: Live gameplay with move validation

### Social & Community
- **Teams/Houses**: Shared ladders and prestige systems
- **Spectator Mode**: Watch matches with token betting
- **Content Tools**: Auto-clipping and one-tap sharing
- **Tournaments**: User-created events with custom rules

### Economy & Progression
- **Token System**: Earned and purchasable gameplay currency
- **Cash Wagering**: Real money stakes for high-stakes matches
- **Cosmetics**: Rank-specific skins and seasonal drops
- **Continuous Elo**: No resets, persistent progression

## 🎨 Design System

### Color Palette
- **Primary**: Dark luxury (black/charcoal backgrounds)
- **Accent**: Gold (#eab308) for primary actions and highlights
- **Secondary**: Emerald (#10b981) for success states and cash features
- **Neutral**: Charcoal grays for UI elements

### Typography
- **Headings**: Playfair Display (serif) for luxury feel
- **Body**: Inter (sans-serif) for readability

### Components
- **Luxury Cards**: Glassmorphism with backdrop blur
- **Gradient Buttons**: Gold and emerald gradients with hover effects
- **Animated Elements**: Smooth transitions and glowing effects

## 🛠 Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Icon library

### Backend (Planned)
- **Node.js/Express** or **Python/FastAPI**
- **PostgreSQL**: User data, matches, rankings
- **Redis**: Real-time features, caching, matchmaking
- **WebSocket**: Live gameplay and spectator features

### Game Engine
- **Stockfish**: Move validation and anti-cheat analysis
- **Chess.js**: Game state management
- **Custom Elo/Glicko-2**: Rating system implementation

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18.0 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd knightfall
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Current Implementation

### ✅ Completed
- **Dark Luxury Theme**: Complete design system with custom colors and components
- **Dashboard Layout**: Three-panel layout (sidebar, main, right panel)
- **Navigation**: Full navigation system with active states
- **Chess Board**: Basic interactive chess board component
- **Matchmaking**: Wager selection and game mode interface
- **Responsive Design**: Mobile-friendly layout structure

### 🚧 In Progress
- **Game Logic**: Chess move validation and game state management
- **Real-time Features**: WebSocket integration for live gameplay
- **User Authentication**: Login and registration system
- **Backend API**: Server-side logic and database integration

### 📋 Planned
- **Anti-Cheat System**: Stockfish integration and behavioral analysis
- **Payment Processing**: Stripe/PayPal integration for cash wagering
- **Social Features**: Teams, chat, and spectator mode
- **Mobile Apps**: React Native implementation
- **Tournament System**: Custom tournament creation and management

## 🎮 Game Modes

### Ladder Matches
- **Token Ladder**: Chess ranks (Pawn → Crown) with token wagers
- **Cash Ladder**: Precious metals theme with real money stakes
- **Elo Matchmaking**: Glicko-2 rating system for fair matches

### Puzzle Ladder
- **Curated Puzzles**: Hand-picked tactical positions
- **Procedural Generation**: Algorithmically created challenges
- **Separate Rating**: Independent puzzle Elo system

### Battle Royale
- **Knockout Brackets**: 1v1 elimination tournaments
- **Arena Mode**: Free-for-all simultaneous play
- **Lives System**: Multiple lives elimination format

## 🔒 Security & Fair Play

### Anti-Cheat Measures
- **Stockfish Analysis**: Engine evaluation of all moves
- **Behavioral Fingerprinting**: Pattern detection and analysis
- **Device Tracking**: Multi-device usage monitoring
- **Public Transparency**: Fair play reports and statistics

### Payment Security
- **Escrow System**: Secure wager holding during matches
- **Fraud Detection**: Advanced payment monitoring
- **Compliance**: Regulatory compliance for real money gaming

## 📈 Monetization

### Revenue Streams
- **Token Sales**: Premium token packages
- **Tournament Rake**: Percentage from tournament entry fees
- **Premium Cosmetics**: Exclusive skins and animations
- **Subscription**: Premium features and benefits

### Economy Balance
- **Token Earning**: Daily rewards, achievements, and wins
- **Cash Conversion**: Optional token-to-cash conversion
- **Seasonal Events**: Limited-time opportunities and rewards

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details on:

- Code style and standards
- Pull request process
- Issue reporting
- Development setup

## 📄 License

This project is proprietary software. All rights reserved.

## 🎯 Roadmap

### Phase 1: Core MVP (Current)
- [x] UI/UX Design System
- [x] Basic Chess Engine
- [x] Matchmaking Interface
- [ ] User Authentication
- [ ] Basic Game Logic

### Phase 2: Social Features
- [ ] Teams/Houses System
- [ ] Chat and Messaging
- [ ] Spectator Mode
- [ ] Content Sharing

### Phase 3: Advanced Features
- [ ] Tournament System
- [ ] Anti-Cheat Implementation
- [ ] Payment Processing
- [ ] Mobile Apps

### Phase 4: Scale & Polish
- [ ] Performance Optimization
- [ ] Advanced Analytics
- [ ] International Expansion
- [ ] Advanced Social Features

---

**Knightfall** - Where strategy meets stakes. ⚔️👑
