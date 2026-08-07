/*
 * Skamber OS — canonical owner data contract.
 * Every visible identity string in the interface is derived from this file.
 * Nothing here may be hard-coded into markup or event handlers.
 *
 * Build Contract v2, approved 2026-08-06.
 */

export const ownerProfile = {
  identity: {
    fullName: "Musa Sulaiman",
    shortName: "Musa",
    osName: "Skamber OS",
    // Single source of truth — metadata, canonical, OG, JSON-LD and
    // sitemap all derive from this constant.
    domain: "skamber.xyz",
    location: "Kebbi, Nigeria",
    timezone: "Africa/Lagos",
    timezoneLabel: "WAT",
    roles: [
      "Founder",
      "AI Product Engineer",
      "Full-Stack Engineer",
      "Product Designer",
      "Entrepreneur"
    ],
    headline: "Building the future of African fintech with AI.",
    intro:
      "Founder of Zipa — creating modern financial infrastructure and AI-powered products designed for the next generation.",
    positioning:
      "I build AI-native products and fintech infrastructure that solve real problems across Africa, turning ambitious ideas into production-ready software.",
    portrait: "assets/portraits/avatar-hero.webp",
    mark: "assets/portraits/avatar-mark.webp",
    // Rotating system descriptor for the identity module.
    descriptors: [
      "SKAMBER OS",
      "AI PRODUCT ENGINEER",
      "FINTECH INFRASTRUCTURE",
      "FOUNDER MODE: ACTIVE"
    ]
  },

  imageGeneration: {
    mode: "native",
    provider: "in-environment",
    model: "gemini-3.1-flash-image",
    apiKeyEnvironmentVariable: null,
    approvedSourceImages: [
      "owner portrait — white kaftan, seated, warm study",
      "owner portrait — white shirt with watch, seated, warm study",
      "owner portrait — third supplied frame"
    ],
    likenessNotes:
      "Deep rich dark brown skin tone; short cropped natural black hair, tapered sides, defined hairline; light thin beard and moustache; calm confident expression. Rights confirmed by owner 2026-08-06.",
    requiredOutputs: [
      "avatar hero",
      "avatar states: idle/happy/sad/excited",
      "nav + boot mark 32-48px",
      "companion states",
      "app icon family",
      "case art: Zipa, OneDev Studio"
    ],
    finalApprovalBy: "Musa Sulaiman"
  },

  conversion: {
    primaryLabel: "Explore My Work",
    primaryAction: "open:projects",
    secondaryLabel: "Build With Me",
    secondaryAction: "open:contact",
    // C4: no booking provider in v1. Book-a-call routes into Contact.
    bookingUrl: null,
    bookingEnabled: false,
    email: "musa@usezipa.xyz",
    whatsapp: [
      { label: "Nigeria", e164: "+2347066612292", display: "+234 706 661 2292" },
      { label: "International", e164: "+13642321439", display: "+1 364 232 1439" }
    ],
    availability: "Open to founding-engineer work, product builds and collaborations"
  },

  /*
   * Metric contract. Permitted status values:
   * verified | client-reported | founder-reported | estimated | illustrative | private
   * Anything without an approved status is omitted, never guessed.
   */
  metrics: [
    {
      value: "Live",
      label: "Zipa — public beta on test networks",
      status: "verified",
      source: "usezipa.xyz, checked 2026-08-06",
      public: true,
      lastVerified: "2026-08-06"
    },
    {
      value: "Solo",
      label: "Zipa built and shipped single-handed",
      status: "founder-reported",
      source: "owner intake",
      public: true,
      lastVerified: "2026-08-06"
    },
    {
      value: "3",
      label: "chains integrated — Solana, Ethereum, Base",
      status: "verified",
      source: "usezipa.xyz product copy",
      public: true,
      lastVerified: "2026-08-06"
    },
    {
      value: "5",
      label: "Nigerian languages supported in Zipa",
      status: "verified",
      source: "usezipa.xyz product copy",
      public: true,
      lastVerified: "2026-08-06"
    }
  ],

  projects: [
    {
      id: "zipa",
      name: "Zipa",
      client: "Independent — founder project",
      category: "Crypto banking / Fintech",
      dates: "2025 — present",
      role: "Founder, Product Lead, Full-Stack Engineer",
      problem:
        "Crypto in Nigeria is built for traders, not people. Wallet addresses are hostile, gas is jargon, and getting paid means copying a 44-character string and hoping.",
      intervention:
        "A username-first crypto bank. Embedded wallets created silently on sign-up, transfers addressed to @handles instead of addresses, an instant internal ledger for fee-free transfers between users, AI that explains every transaction in plain language, and naira-aware balances so the numbers mean something locally.",
      outcome: "Live public beta on test networks — free to use, no real-money custody yet.",
      outcomeStatus: "verified",
      url: "https://usezipa.xyz",
      repository: null,
      image: "assets/cases/zipa.webp",
      stack: ["Solana", "Ethereum", "Base", "Privy", "Supabase", "Helius"],
      services: ["Product engineering", "Fintech infrastructure", "AI integration"],
      featured: true
    },
    {
      id: "onedev",
      name: "OneDev Studio",
      client: "Independent — founder venture",
      category: "Software development studio",
      dates: "Active",
      role: "Founder",
      problem:
        "Teams with a clear product idea and no engineering bench need someone who can take it from brief to shipped software.",
      intervention:
        "A small studio practice covering product design, full-stack build and AI integration.",
      outcome: "Active studio.",
      outcomeStatus: "founder-reported",
      url: null,
      repository: null,
      image: "assets/cases/onedev.webp",
      stack: [],
      services: ["Product design", "Full-stack engineering", "AI integration"],
      featured: true
    }
  ],

  // Populated only when a working repository or live demo exists.
  experiments: [],

  // C5: no approved testimonial material. App ships with an honest empty state.
  testimonials: [],
  videos: [],
  /*
   * Music plays through Spotify's own embedded player — licensed streaming,
   * no audio files hosted here, no autoplay. Add tracks by Spotify track id.
   */
  music: [
    {
      spotifyTrackId: "0KDFkRPKXU70f724iDRz8W",
      title: "D.N.M.P Do Not Disturb My Peace",
      note: "Owner-selected soundtrack"
    }
  ],
  achievements: [],
  journey: [],

  services: [
    {
      name: "AI-native product engineering",
      body: "Products where the AI is the product, not a bolt-on — built to ship, not to demo."
    },
    {
      name: "Fintech infrastructure",
      body: "Wallets, ledgers, on-chain rails and the unglamorous plumbing that has to be right."
    },
    {
      name: "Full-stack build",
      body: "Design through deployment, end to end, by one person who owns the outcome."
    }
  ],

  socials: [
    {
      network: "X",
      handle: "@0xSkamber",
      url: "https://x.com/0xSkamber",
      purpose: "Build notes and product updates",
      status: "active"
    },
    {
      network: "GitHub",
      handle: "KAMBAH123",
      url: "https://github.com/KAMBAH123",
      purpose: "Code and open-source work",
      status: "active"
    }
  ],

  articles: [],

  /*
   * Voice agents. `enabled: false` renders the maintenance state.
   * To go live: create an agent with the vendor, paste its PUBLIC agent id
   * here, set enabled: true. Public ids only — never an API key.
   * Supported vendors: "elevenlabs" (recommended), "vapi".
   */
  voiceAgents: {
    enabled: true,
    vendor: "elevenlabs",
    agents: [
      {
        id: "agent_8501kzdra76be4arp1cfx9cqw6vp",
        name: "Skamber Assistant",
        purpose:
          "Ask about my work, how I build, or whether your project is a fit. A live demonstration of the kind of AI agent I ship for clients.",
        disclosure: "You are talking to an AI agent, not to Musa."
      }
    ]
  },

  themes: {
    default: "night",
    available: ["day", "night", "dark"]
  },

  legal: {
    copyrightOwner: "Musa Sulaiman",
    assetLicenses: [
      "Owner portraits — supplied by owner, rights confirmed 2026-08-06",
      "OneDev brand mark — owned by Musa Sulaiman",
      "Avatar and companion artwork — generated for this build, derived from approved owner photos"
    ],
    metricDisclaimer:
      "Metrics are labelled by verification status. Founder-reported figures have not been independently audited."
  }
};

export const STATUS_LABEL = {
  verified: "Verified",
  "client-reported": "Client-reported",
  "founder-reported": "Founder-reported",
  estimated: "Estimated",
  illustrative: "Illustrative"
};

/** Metrics safe to render. `private` never leaves this function. */
export function publicMetrics() {
  return ownerProfile.metrics.filter((m) => m.public && m.status !== "private");
}
