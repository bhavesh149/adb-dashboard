# ADmyBRAND Insights - Analytics Dashboard

A modern, responsive analytics dashboard built with Next.js 15, featuring real-time data integration, interactive charts, and a mobile-first design. This dashboard provides comprehensive business insights with team management capabilities and live data updates.

![Dashboard Preview](public/placeholder.svg)

## 🚀 Features

### Core Functionality
- **Real-time Data Updates**: Live dashboard refresh every 10 seconds with external API integration
- **Team Management**: Multi-team support with team switching and data isolation
- **Interactive Analytics**: Comprehensive charts and visualizations using Recharts
- **Mobile-First Design**: Fully responsive across all device sizes
- **Dark/Light Theme**: Built-in theme switching with system preference detection
- **Export Capabilities**: Data export functionality for reports and analytics

### Data Sources
- **CoinDesk API**: Real-time cryptocurrency pricing data
- **RandomUser API**: Realistic user profile data for demonstrations
- **JSONPlaceholder**: Mock data for enhanced realism
- **Dynamic Multipliers**: Team-specific data scaling for realistic variations

### Interactive Components
- **Metric Cards**: Click-to-refresh functionality with loading states
- **Date Range Picker**: Advanced date filtering with preset options
- **Activity Feed**: Real-time user activity tracking
- **Top Channels**: Traffic source analysis with performance indicators
- **Analytics Charts**: Traffic, conversion, and demographic visualizations

## 🛠️ Tech Stack

### Frontend Framework
- **Next.js 15.2.4** - React framework with App Router
- **React 19** - Latest React with enhanced features
- **TypeScript 5** - Type-safe development

### UI & Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful icon library
- **Recharts** - Composable charting library

### State Management & Data
- **React Context API** - Team state management
- **React Hooks** - Modern state management patterns
- **Local Storage** - Client-side data persistence
- **External APIs** - Real-time data integration

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization

## 📁 Project Structure

```
admybrand-dashboard/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with providers
│   ├── loading.tsx              # Global loading UI
│   ├── page.tsx                 # Main dashboard page
│   ├── customers/               # Customer management pages
│   ├── products/                # Product management pages
│   └── settings/                # Settings pages
├── components/                   # Reusable UI components
│   ├── ui/                      # shadcn/ui base components
│   ├── activity-feed.tsx        # Activity tracking component
│   ├── analytics-charts.tsx     # Chart visualizations
│   ├── app-sidebar.tsx          # Navigation sidebar
│   ├── date-range-picker.tsx    # Date filtering component
│   ├── main-nav.tsx             # Main navigation
│   ├── metric-card.tsx          # KPI metric cards
│   ├── overview.tsx             # Overview charts
│   ├── recent-sales.tsx         # Sales activity component
│   ├── search.tsx               # Search functionality
│   ├── team-switcher.tsx        # Team selection component
│   ├── theme-provider.tsx       # Theme context provider
│   ├── theme-toggle.tsx         # Theme switching button
│   ├── top-channels.tsx         # Traffic source analysis
│   └── user-nav.tsx             # User navigation menu
├── hooks/                       # Custom React hooks
│   ├── use-mobile.tsx           # Mobile detection hook
│   └── use-toast.ts             # Toast notification hook
├── lib/                         # Utility libraries
│   ├── api.ts                   # API integration and data generation
│   ├── mock-data.ts             # Mock data generators
│   ├── team-context.tsx         # Team management context
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
├── styles/                      # Additional stylesheets
├── components.json              # shadcn/ui configuration
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** - JavaScript runtime
- **pnpm** - Package manager (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bhavesh149/adb-dashboard.git
   cd adb-dashboard
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open the application**
   ```
   http://localhost:3000
   ```

### Alternative Package Managers
```bash
# Using npm
npm install
npm run dev

# Using yarn
yarn install
yarn dev
```

## 📱 Mobile Responsiveness

The dashboard is built with a mobile-first approach and includes:

### Responsive Breakpoints
- **Mobile**: `< 640px` - Single column layout, compact components
- **Tablet**: `640px - 1024px` - Two-column grid, medium spacing
- **Desktop**: `> 1024px` - Full three-column layout, expanded features

### Mobile Features
- **Mobile Action Bar**: Fixed bottom navigation with quick actions
- **Touch-Friendly Interface**: Optimized button sizes and touch targets
- **Responsive Typography**: Adaptive text sizes across screen sizes
- **Compact Layouts**: Space-efficient designs for small screens
- **Swipe Gestures**: Native mobile interactions where appropriate

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configurations:
```env
# Optional: Add API keys for external services
NEXT_PUBLIC_API_BASE_URL=your_api_url
```

### Theme Configuration
The dashboard supports light/dark themes with system preference detection. Themes can be customized in:
- `components/theme-provider.tsx` - Theme context and provider
- `tailwind.config.ts` - Color scheme and design tokens

### Team Configuration
Teams can be configured in `lib/team-context.tsx`:
```typescript
const defaultTeams = [
  { id: 'marketing', name: 'Marketing Team', multiplier: 1.2 },
  { id: 'sales', name: 'Sales Team', multiplier: 0.8 },
  { id: 'support', name: 'Support Team', multiplier: 1.5 }
]
```

## 🎨 Customization

### Adding New Components
1. Create component in `components/` directory
2. Use TypeScript for type safety
3. Follow shadcn/ui patterns for consistency
4. Add responsive classes for mobile support

### Modifying Themes
1. Update color variables in `tailwind.config.ts`
2. Add new theme variants in `components/theme-provider.tsx`
3. Test across light/dark modes

### Adding New Data Sources
1. Add API integration in `lib/api.ts`
2. Update data types in component interfaces
3. Handle loading and error states

## 📊 Data Management

### Real-Time Updates
The dashboard refreshes data every 10 seconds:
- **Metrics**: Revenue, users, orders, conversion rates
- **Charts**: Traffic data, analytics, demographics
- **Activities**: User activities and recent sales

### External API Integration
- **CoinDesk API**: Cryptocurrency pricing data
- **RandomUser API**: User profile generation
- **Fallback Data**: Mock data when APIs are unavailable

### Team-Specific Data
Each team has unique data multipliers for realistic variations:
- Marketing Team: 1.2x multiplier
- Sales Team: 0.8x multiplier  
- Support Team: 1.5x multiplier

## 🏗️ Build & Deployment

### Development Build
```bash
pnpm dev          # Start development server
pnpm lint         # Run ESLint checks
```

### Production Build
```bash
pnpm build        # Build for production
pnpm start        # Start production server
```

### Deployment Options
- **Vercel**: Optimal for Next.js applications
- **Netlify**: Static site hosting with edge functions
- **Docker**: Containerized deployment
- **Traditional Hosting**: Any Node.js hosting provider

## 🧪 Testing

### Manual Testing Checklist
- [ ] Dashboard loads without errors
- [ ] Real-time data updates working
- [ ] Team switching functionality
- [ ] Mobile responsiveness across devices
- [ ] Theme switching (light/dark)
- [ ] Export functionality
- [ ] Date range filtering
- [ ] Interactive charts and components

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔄 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 📦 Key Dependencies

### Core Framework
- `next@15.2.4` - React framework
- `react@19` - UI library
- `typescript@5` - Type system

### UI Components
- `@radix-ui/*` - Accessible component primitives
- `lucide-react` - Icon library
- `tailwindcss` - CSS framework

### Charts & Visualization
- `recharts` - Chart library
- `date-fns` - Date manipulation

### State Management
- `react-hook-form` - Form handling
- `zod` - Schema validation

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill process on port 3000
   npx kill-port 3000
   # Or use different port
   pnpm dev -- -p 3001
   ```

2. **Module Resolution Errors**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

3. **Build Errors**
   ```bash
   # Check TypeScript errors
   pnpm lint
   # Clean build cache
   rm -rf .next
   pnpm build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use TypeScript for all components
- Follow responsive design patterns
- Add proper error handling
- Include loading states
- Test on multiple devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Excellent React framework
- **shadcn** - Beautiful component library
- **Radix UI** - Accessible primitives
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the [documentation](README.md)
- Review the component examples in `/components`

---

**Built with ❤️ using Next.js 15, React 19, and modern web technologies.**
