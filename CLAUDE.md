# GymScreen - Project Context voor Claude Code

## PROJECT OVERZICHT

**Naam:** GymScreen
**Doel:** Display applicatie voor gym schermen (TV's, tablets)
**Status:** Initial Setup

### Architectuur
```
┌─────────────────────────────────────────────────────────────┐
│                     SUPABASE (shared)                       │
│   Gedeelde database met MMA Gym CRM                         │
│   - members, belts, schedules, classes, etc.                │
└─────────────────────────────────────────────────────────────┘
            ▲                              ▲
            │                              │
    ┌───────┴───────┐              ┌───────┴───────┐
    │   CRM App     │              │  GymScreen    │
    │  (mma-gym-crm)│              │  (dit project)│
    │               │              │               │
    │ - Shop module │              │ - Display app │
    │ - Members     │              │ - Lesrooster  │
    │ - Scheduling  │              │ - Aankondig.  │
    └───────────────┘              └───────────────┘
```

## TECHNISCHE STACK

```
Frontend:     Vite + React 18 + TypeScript
Styling:      Tailwind CSS
State:        React Query (TanStack Query)
Backend:      Supabase (ZELFDE database als CRM!)
```

## MAPPENSTRUCTUUR

```
gymscreen/
├── CLAUDE.md                    # Dit bestand
├── src/
│   ├── components/              # React componenten
│   ├── pages/                   # Pagina's / views
│   ├── hooks/                   # Custom React hooks
│   ├── lib/
│   │   └── supabase.ts          # Supabase client
│   └── types/                   # TypeScript types
├── .env                         # Environment variables (NIET committen!)
└── .env.example                 # Voorbeeld env vars
```

## SUPABASE CONNECTIE

Dit project deelt de database met `mma-gym-crm`. De Supabase credentials zijn identiek.

**Beschikbare tabellen (van CRM):**
- `members` - Leden
- `classes` - Lessen
- `class_instances` - Les instanties
- `disciplines` - BJJ, MMA, etc.
- `shop_banners` - Shop banners
- En meer...

## GEPLANDE FEATURES

### Display Modes
1. **Lesrooster** - Vandaag's lessen met tijden en coaches
2. **Welkomstscherm** - Check-ins, nieuwe leden verwelkomen
3. **Announcements** - Belangrijke mededelingen
4. **Fighter Spotlight** - Featured leden/coaches

### Admin Panel (optioneel)
- Scherm configuratie
- Content management
- Display mode selectie

## DEVELOPMENT

```bash
# Start development server
npm run dev

# Build voor productie
npm run build
```

## REGELS VOOR AI

### ALTIJD doen:
1. Lees dit bestand eerst bij elke sessie
2. Gebruik TypeScript - geen `any` types
3. Gebruik Tailwind voor styling
4. Data ophalen via Supabase (gedeelde database)

### NOOIT doen:
1. Geen API keys in code committen
2. Geen duplicate data maken - gebruik CRM tabellen
3. Geen wijzigingen aan CRM database schema zonder overleg

---

*Laatste update: 15 december 2025*
