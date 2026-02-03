# Technical Implementation Plan: Global Expansion

> **Target**: Transform ZeroPack into a global $99 product  
> **Timeline**: 4 weeks  
> **Priority**: High-impact, low-effort first

---

## Phase 1: Internationalization (Week 1)

### 1.1 Install i18n Library

```bash
pnpm add next-intl
```

### 1.2 Project Structure

```
src/
├── i18n/
│   ├── locales/
│   │   ├── en.json          # English (default)
│   │   └── ko.json          # Korean (optional)
│   ├── config.ts            # i18n configuration
│   └── request.ts           # Server-side i18n
├── middleware.ts            # Language detection
└── app/
    └── [locale]/            # Locale-based routing
        ├── layout.tsx
        └── page.tsx
```

### 1.3 English Translation Files

**src/i18n/locales/en.json**:
```json
{
  "landing": {
    "hero": {
      "title": "Deploy Your Website in 2 Clicks",
      "subtitle": "Choose a template, connect GitHub + Vercel, and launch in 3 minutes. Zero monthly costs.",
      "cta": "Start Free Trial",
      "demo": "Watch Demo"
    },
    "features": {
      "title": "Why Developers Love ZeroPack",
      "automation": {
        "title": "11-Step Automation",
        "description": "We handle GitHub fork, Vercel setup, environment variables, DNS, and deployment. You just click."
      },
      "templates": {
        "title": "8 Production Templates",
        "description": "Business, portfolio, e-commerce, blog, agency, SaaS, restaurant, and event sites."
      },
      "cost": {
        "title": "$0/month Hosting",
        "description": "Built on Vercel's free tier. No hidden costs, no subscriptions, no surprises."
      }
    },
    "pricing": {
      "title": "Simple, Transparent Pricing",
      "starter": {
        "name": "Starter",
        "price": "$99",
        "period": "one-time",
        "deployments": "1 deployment",
        "features": [
          "1 website deployment",
          "8 premium templates",
          "Custom subdomain",
          "GitHub + Vercel setup",
          "Free hosting forever",
          "Email support"
        ],
        "cta": "Get Started"
      },
      "pro": {
        "name": "Pro",
        "price": "$299",
        "period": "one-time",
        "popular": true,
        "deployments": "5 deployments",
        "features": [
          "5 website deployments",
          "8 premium templates",
          "Custom subdomains",
          "GitHub + Vercel setup",
          "Free hosting forever",
          "Priority support",
          "Deployment analytics"
        ],
        "cta": "Start Building"
      },
      "business": {
        "name": "Business",
        "price": "$999",
        "period": "one-time",
        "deployments": "Unlimited",
        "features": [
          "Unlimited deployments",
          "8 premium templates",
          "Custom subdomains",
          "GitHub + Vercel setup",
          "Free hosting forever",
          "Priority support",
          "Deployment analytics",
          "White-label option"
        ],
        "cta": "Go Unlimited"
      }
    }
  },
  "templates": {
    "title": "Choose Your Template",
    "subtitle": "All templates are production-ready, fully responsive, and SEO-optimized",
    "categories": {
      "all": "All Templates",
      "business": "Business",
      "portfolio": "Portfolio",
      "ecommerce": "E-commerce",
      "blog": "Blog",
      "agency": "Agency",
      "saas": "SaaS",
      "restaurant": "Restaurant",
      "event": "Event"
    }
  },
  "onboard": {
    "title": "Let's Deploy Your Website",
    "step1": {
      "title": "Connect GitHub",
      "description": "We'll fork the template to your GitHub account",
      "button": "Connect GitHub"
    },
    "step2": {
      "title": "Connect Vercel",
      "description": "We'll create a project and deploy your site",
      "button": "Connect Vercel"
    },
    "deploying": {
      "title": "Deploying Your Website...",
      "steps": [
        "Forking template to your GitHub",
        "Creating Vercel project",
        "Setting up environment variables",
        "Configuring custom domain",
        "Deploying your website"
      ]
    }
  },
  "success": {
    "title": "🎉 Your Website is Live!",
    "subtitle": "Your website has been successfully deployed and is now accessible worldwide.",
    "links": {
      "visit": "Visit Your Website",
      "github": "View on GitHub",
      "vercel": "Vercel Dashboard"
    },
    "next": {
      "title": "What's Next?",
      "customize": "Customize your content through the built-in CMS",
      "domain": "Add a custom domain in Vercel settings",
      "analytics": "Set up analytics to track visitors"
    }
  }
}
```

### 1.4 Middleware for Language Detection

**src/middleware.ts**:
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ko'],
  defaultLocale: 'en',
  localeDetection: true
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
```

---

## Phase 2: Paddle Integration (Week 1)

### 2.1 Install Paddle

```bash
pnpm add @paddle/paddle-node-sdk
```

### 2.2 Paddle Configuration

**lib/paddle.ts**:
```typescript
import { Environment, Paddle } from '@paddle/paddle-node-sdk';

export const paddle = new Paddle(process.env.PADDLE_API_KEY!);

export const PRICING = {
  starter: {
    priceId: process.env.PADDLE_PRICE_STARTER!,
    deployments: 1
  },
  pro: {
    priceId: process.env.PADDLE_PRICE_PRO!,
    deployments: 5
  },
  business: {
    priceId: process.env.PADDLE_PRICE_BUSINESS!,
    deployments: -1
  }
} as const;

export type PlanId = keyof typeof PRICING;
```

### 2.3 Checkout API

**app/api/payment/create/route.ts**:
```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // Auth.js or similar
import { PRICING, PlanId } from '@/lib/paddle';

// Paddle is handled client-side mostly with Paddle.js for checkout overlay
// This API might be for generating a transaction or passing custom data if needed
// Or simpler: Just return the environment config
```

### 2.4 Webhook Handler

**app/api/webhooks/paddle/route.ts**:
```typescript
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { paddle } from '@/lib/paddle';
import { supabase } from '@/lib/supabase-admin';

export async function POST(req: Request) {
  const signature = req.headers.get('paddle-signature') || '';
  const body = await req.text();
      to: email,
      licenseKey: license.key,
      plan,
      deployments: parseInt(deployments),
    });

    console.log(`License created for ${email}: ${license.key}`);
  }

  return NextResponse.json({ received: true });
}
```

### 2.4 Environment Variables

```env
# Paddle
PADDLE_API_KEY=xxx
PADDLE_WEBHOOK_SECRET=xxx
PADDLE_PRICE_STARTER=pri_xxx
PADDLE_PRICE_PRO=pri_xxx
PADDLE_PRICE_BUSINESS=pri_xxx
```

---

## Phase 3: Domain & Branding (Week 2)

### 3.1 New Domain Setup

**Primary Domain**: `zeropack.io`

**DNS Configuration** (Cloudflare):
```
A     @              76.76.21.21 (Vercel)
CNAME www            cname.vercel-dns.com
CNAME zpbook         cname.vercel-dns.com
```

**Vercel Configuration**:
```json
{
  "domains": [
    "zeropack.io",
    "www.zeropack.io",
    "zpbook.zeropack.io"
  ]
}
```

### 3.2 Subdomain Strategy

```
zeropack.io           → Main landing page (English)
zpbook.zeropack.io    → Deployment platform
docs.zeropack.io      → Documentation
blog.zeropack.io      → Content marketing
```

### 3.3 Email Setup

**Domain**: `@zeropack.io`

**Email Addresses**:
- `support@zeropack.io` - Customer support

**Resend Configuration**:
```typescript
// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLicenseEmail({
  to,
  licenseKey,
  plan,
  deployments,
}: {
  to: string;
  licenseKey: string;
  plan: string;
  deployments: number;
}) {
  await resend.emails.send({
    from: 'ZeroPack <noreply@zeropack.io>',
    to,
    subject: '🎉 Your ZeroPack License Key',
    html: `
      <h1>Welcome to ZeroPack!</h1>
      <p>Thank you for your purchase. Here's your license key:</p>
      <div style="background: #f5f5f5; padding: 20px; font-family: monospace; font-size: 18px;">
        ${licenseKey}
      </div>
      <p><strong>Plan:</strong> ${plan}</p>
      <p><strong>Deployments:</strong> ${deployments === -1 ? 'Unlimited' : deployments}</p>
      <p>Get started: <a href="https://zpbook.zeropack.io">zpbook.zeropack.io</a></p>
    `,
  });
}
```

---

## Phase 4: Marketing Assets (Week 2-3)

### 4.1 Demo Video Script

**Duration**: 90 seconds

**Script**:
```
[0:00-0:10] Hook
"Want to launch a website in 2 clicks? Watch this."

[0:10-0:30] Problem
"Setting up a website usually takes hours:
- Fork a repo
- Configure Vercel
- Set environment variables
- Set up a domain
- Deploy

What if it took 2 minutes instead?"

[0:30-1:00] Solution
"With ZeroPack:
1. Choose a template (8 options)
2. Click 'Deploy'
3. Connect GitHub + Vercel
4. Done.

Your site is live with:
✓ Custom domain
✓ SSL certificate
✓ GitHub repo
✓ Vercel project
✓ All environment variables

All automated."

[1:00-1:20] Demo
[Screen recording showing actual deployment]

[1:20-1:30] CTA
"Try it free at zeropack.io
One-time payment. No monthly fees.
$99 for 5 deployments."
```

### 4.2 Product Hunt Assets

**Thumbnail** (1270x760px):
```
[Bold Text]
Deploy a Website
in 2 Clicks

[Subtext]
GitHub + Vercel + DNS
All Automated

[Badge]
$0/month hosting
```

**Gallery Images** (5 images):
1. Before/After comparison
2. Template selection screen
3. OAuth connection flow
4. Deployment progress
5. Success screen with live site

### 4.3 Social Media Templates

**Twitter/X Header** (1500x500px):
```
ZeroPack
Deploy websites in 2 clicks
$0/month hosting
```

**LinkedIn Banner**:
```
Automate Your Website Deployment
2 Clicks. 3 Minutes. $99.
```

---

## Phase 5: Analytics & Tracking (Week 3)

### 5.1 Google Analytics 4

```typescript
// lib/analytics.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
```

**Key Events to Track**:
```typescript
// Landing page
event({ action: 'view_landing', category: 'engagement', label: 'home' });

// Template selection
event({ action: 'select_template', category: 'conversion', label: templateId });

// OAuth
event({ action: 'connect_github', category: 'conversion', label: 'oauth' });
event({ action: 'connect_vercel', category: 'conversion', label: 'oauth' });

// Deployment
event({ action: 'deployment_started', category: 'conversion', label: templateId });
event({ action: 'deployment_completed', category: 'conversion', label: templateId });

// Payment
event({ action: 'view_pricing', category: 'engagement', label: 'pricing' });
event({ action: 'initiate_checkout', category: 'conversion', label: plan });
event({ action: 'purchase', category: 'conversion', label: plan, value: price });
```

### 5.2 Mixpanel for Funnel Analysis

```typescript
import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!);

export const trackFunnel = {
  landingView: () => mixpanel.track('Landing Page View'),
  templateSelect: (templateId: string) => mixpanel.track('Template Selected', { templateId }),
  githubConnect: () => mixpanel.track('GitHub Connected'),
  vercelConnect: () => mixpanel.track('Vercel Connected'),
  deploymentStart: () => mixpanel.track('Deployment Started'),
  deploymentSuccess: () => mixpanel.track('Deployment Success'),
  purchaseComplete: (plan: string, amount: number) => 
    mixpanel.track('Purchase', { plan, amount }),
};
```

---

## Phase 6: SEO Optimization (Week 3-4)

### 6.1 Meta Tags

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'ZeroPack - Deploy Websites in 2 Clicks | $0/month Hosting',
  description: 'Automate your website deployment with GitHub + Vercel + DNS. Choose a template, click twice, launch in 3 minutes. One-time payment, no monthly fees.',
  keywords: 'website deployment, vercel automation, github deployment, no-code website, nextjs deployment, free hosting',
  openGraph: {
    title: 'ZeroPack - Deploy Websites in 2 Clicks',
    description: 'Automate your website deployment. $99 one-time, $0/month hosting.',
    url: 'https://zeropack.io',
    siteName: 'ZeroPack',
    images: [
      {
        url: 'https://zeropack.io/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZeroPack - Deploy Websites in 2 Clicks',
    description: 'Automate your website deployment. $99 one-time, $0/month hosting.',
    images: ['https://zeropack.io/twitter-image.png'],
  },
};
```

### 6.2 Schema.org Structured Data

```typescript
// components/StructuredData.tsx
export function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ZeroPack',
    applicationCategory: 'DeveloperApplication',
    offers: {
      '@type': 'Offer',
      price: '99.00',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## Implementation Checklist

### Week 1: Core Internationalization
- [ ] Install `next-intl`
- [ ] Create English translation files
- [ ] Update all UI components to use translations
- [ ] Set up language detection middleware
- [ ] Test English version thoroughly

### Week 1: Paddle Integration
- [ ] Create Paddle account
- [ ] Set up products ($29, $99, $199)
- [ ] Implement payment API routes
- [ ] Set up webhook for license generation
- [ ] Test payment flow end-to-end

### Week 2: Domain & Branding
- [ ] Purchase `zeropack.io` domain
- [ ] Configure DNS (Cloudflare)
- [ ] Set up email (@zeropack.io)
- [ ] Update all links to new domain
- [ ] Set up SSL certificates

### Week 2-3: Marketing Assets
- [ ] Write demo video script
- [ ] Record and edit demo video
- [ ] Create Product Hunt thumbnail
- [ ] Design 5 gallery images
- [ ] Prepare social media graphics

### Week 3: Analytics
- [ ] Set up Google Analytics 4
- [ ] Implement Mixpanel tracking
- [ ] Create conversion funnel
- [ ] Set up goal tracking
- [ ] Test all events

### Week 3-4: SEO
- [ ] Optimize meta tags
- [ ] Add structured data
- [ ] Create sitemap.xml
- [ ] Submit to Google Search Console
- [ ] Write 3 blog posts

### Week 4: Launch Preparation
- [ ] Create Product Hunt profile
- [ ] Write launch post
- [ ] Prepare FAQ
- [ ] Set up Discord server
- [ ] Schedule launch (Tuesday 12:01 AM PST)

---

**Total Estimated Time**: 120-160 hours  
**Budget**: ~$1,500  
**Expected ROI**: 6-10x in first 3 months
