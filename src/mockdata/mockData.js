// Shared icons + mock data for DTAgent
const Icon = ({ name, size = 16, stroke = 1.6 }) => {
  const paths = {
    home: "M3 12l9-9 9 9M5 10v10h14V10",
    chat: "M21 12a8 8 0 1 1-3-6.2L21 4l-1 4a8 8 0 0 1 1 4z",
    bell: "M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 0 0 4 0",
    search: "M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.3-4.3",
    settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
    send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
    close: "M18 6L6 18M6 6l12 12",
    menu: "M3 6h18M3 12h18M3 18h18",
    bookmark: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
    share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
    external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3",
    chevron: "M6 9l6 6 6-6",
    chevronR: "M9 6l6 6-6 6",
    arrowUp: "M12 19V5M5 12l7-7 7 7",
    arrowDown: "M12 5v14M19 12l-7 7-7-7",
    arrowRight: "M5 12h14M12 5l7 7-7 7",
    sparkle: "M12 3v18M3 12h18M5.6 5.6l12.8 12.8M5.6 18.4L18.4 5.6",
    check: "M20 6L9 17l-5-5",
    plus: "M12 5v14M5 12h14",
    trash: "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
    refresh: "M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5",
    pause: "M6 4h4v16H6zM14 4h4v16h-4z",
    play: "M5 3l14 9-14 9V3z",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    eyeOff: "M17.94 17.94A10 10 0 0 1 12 20c-7 0-11-8-11-8a18 18 0 0 1 5.1-5.9M9.9 4.2A10 10 0 0 1 12 4c7 0 11 8 11 8a18 18 0 0 1-2.2 3.2M14.1 14.1a3 3 0 1 1-4.2-4.2M1 1l22 22",
    download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    filter: "M22 3H2l8 9.5V19l4 2v-8.5z",
    layers: "M12 2l10 5-10 5L2 7l10-5zM2 12l10 5 10-5M2 17l10 5 10-5",
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    chart: "M3 3v18h18M7 14l4-4 4 4 5-5",
    barChart: "M12 20V10M18 20V4M6 20v-6",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
    flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22V15",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    server: "M2 4h20v6H2zM2 14h20v6H2zM6 7h.01M6 17h.01",
    db: "M12 3c-5 0-9 1.3-9 3v12c0 1.7 4 3 9 3s9-1.3 9-3V6c0-1.7-4-3-9-3zM3 6c0 1.7 4 3 9 3s9-1.3 9-3M3 12c0 1.7 4 3 9 3s9-1.3 9-3",
    sliders: "M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6",
    mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
    phone: "M22 16.9v3a2 2 0 0 1-2.2 2A20 20 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.7 4a2 2 0 0 1-.5 2L7.9 11a16 16 0 0 0 6 6l1.3-1.4a2 2 0 0 1 2-.5l4 .7a2 2 0 0 1 1.7 2z",
    sun: "M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z",
    moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
    sparkles: "M9 3l1.5 4.5L15 9l-4.5 1.5L9 15l-1.5-4.5L3 9l4.5-1.5zM18 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1z",
    clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5H6.5A2.5 2.5 0 0 0 4 19.5z",
    quotes: "M3 21c3-2 5-5 5-9V5H3v7h4M21 21c3-2 5-5 5-9V5h-5v7h4",
    starOutline: "M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z",
    alert: "M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
    info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01",
    listFilter: "M3 6h18M7 12h10M11 18h2",
    inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.5 5h13l3 7v6a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2v-6z",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  };
  const d = paths[name] || paths.home;
  return React.createElement('svg', {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round",
    className: "icon"
  }, React.createElement('path', { d }));
};

// ===== mock data =====
const TODAY = "Wednesday, May 6, 2026";

const SOURCES = [
  { id: 'idn',  name: 'Inside Dentistry',          mark: 'ID',  status: 'good',  last: '4:58 AM', count: 14, total: 1242 },
  { id: 'idh',  name: 'Inside Dental Hygiene',     mark: 'IDH', status: 'good',  last: '5:01 AM', count: 6,  total: 504 },
  { id: 'cxd',  name: 'Conexiant Dental',          mark: 'CX',  status: 'good',  last: '5:02 AM', count: 9,  total: 612 },
  { id: 'ada',  name: 'ADA News',                  mark: 'ADA', status: 'good',  last: '5:00 AM', count: 11, total: 1855 },
  { id: 'da',   name: 'The Dental Advisor',        mark: 'DA',  status: 'warn',  last: '4:51 AM', count: 2,  total: 88 },
  { id: 'ddh',  name: 'Dimensions of Dental Hyg.', mark: 'DDH', status: 'bad',   last: 'Failed',  count: 0,  total: 312 },
  { id: 'did',  name: 'Decisions in Dentistry',    mark: 'DiD', status: 'good',  last: '5:03 AM', count: 7,  total: 590 },
  { id: 'diq',  name: 'DentistryIQ',               mark: 'DIQ', status: 'good',  last: '5:00 AM', count: 12, total: 1431 },
  { id: 'dt',   name: 'Dental Tribune US',         mark: 'DT',  status: 'good',  last: '5:04 AM', count: 8,  total: 977 },
  { id: 'dph',  name: 'Dental Products Hopper',    mark: 'DPH', status: 'good',  last: '5:02 AM', count: 5,  total: 421 },
  { id: 'drb',  name: 'DrBicuspid.com',            mark: 'DrB', status: 'good',  last: '4:59 AM', count: 9,  total: 1108 },
];

const ARTICLES = [
  { id: 1, source: 'ADA News', mark: 'ADA', time: '2h ago', headline: "ADA releases updated infection-control guidance for 2026 in response to evolving aerosol research",
    summary: "The American Dental Association has issued revised infection-control protocols emphasizing high-volume evacuation and N95 use during aerosol-generating procedures. The 14-page update consolidates eight separate advisories from the past three years and takes effect July 1, 2026.",
    cats: ['Regulations','Clinical'], feature: true, reads: 3127 },
  { id: 2, source: 'Inside Dentistry', mark: 'ID', time: '3h ago', headline: "AI-assisted caries detection clears 510(k) hurdle, expected in chairside units by Q4",
    summary: "VistaCheck's deep-learning module received FDA clearance after a 12,000-image multi-site study showed 94% sensitivity for proximal lesions. Three major chairside imaging vendors have signaled integration plans before the end of the year.",
    cats: ['Technology','Clinical'], reads: 2104 },
  { id: 3, source: 'DentistryIQ', mark: 'DIQ', time: '4h ago', headline: "Survey: 62% of hygienists report burnout symptoms, up six points year-over-year",
    summary: "RDH Magazine's annual workforce survey of 4,200 dental hygienists shows the steepest year-over-year burnout climb on record. Schedule density and ergonomic strain top the list of contributing factors, ahead of compensation.",
    cats: ['Hygiene','Business'], reads: 1820 },
  { id: 4, source: 'Dental Products Hopper', mark: 'DPH', time: '5h ago', headline: "3Shape ships TRIOS 6 with on-scanner AI bite analysis and Wi-Fi 7",
    summary: "The newest TRIOS adds a real-time occlusion heat-map and a 30% faster scan path. Pricing starts at $34,500 with trade-in credit for existing TRIOS 4/5 units; first deliveries are scheduled for late June.",
    cats: ['Products','Technology'], reads: 1455 },
  { id: 5, source: 'Decisions in Dentistry', mark: 'DiD', time: '6h ago', headline: "Silver diamine fluoride coverage expands to 24 state Medicaid programs",
    summary: "A Pew Trust analysis published this morning shows SDF reimbursement now reaches 24 state programs, up from 17 last year. Pediatric utilization in covered states is averaging 3.4× pre-coverage rates.",
    cats: ['Clinical','Regulations'], reads: 1189 },
  { id: 6, source: 'Dental Tribune US', mark: 'DT', time: '7h ago', headline: "Mid-market DSO consolidation accelerates as private equity returns to dental",
    summary: "Two transactions announced this week — Heartland's add-on of 14 Pacific Northwest practices and Smile Brands' move into Georgia — push 2026 mid-market deal volume above all of 2025.",
    cats: ['Business'], reads: 980 },
  { id: 7, source: 'Inside Dental Hygiene', mark: 'IDH', time: '8h ago', headline: "New study links chronic periodontitis to elevated cardiovascular event risk in adults under 50",
    summary: "A 14,000-patient retrospective from Cleveland Clinic links severe periodontitis to a 1.7× increase in cardiovascular events among adults aged 30–49 — the strongest signal yet in this age cohort.",
    cats: ['Clinical','Hygiene'], reads: 871 },
  { id: 8, source: 'DrBicuspid.com', mark: 'DrB', time: '9h ago', headline: "OSHA cites three NY practices for sterilization recordkeeping gaps after surprise inspections",
    summary: "Citations stemmed from missing biological monitoring logs and incomplete autoclave maintenance records. Fines averaged $14,200 per practice; OSHA signals expanded inspection sweeps in Q3.",
    cats: ['Regulations','Business'], reads: 642 },
  { id: 9, source: 'Conexiant Dental', mark: 'CX', time: '10h ago', headline: "Implant survival rates at 15 years now exceed 96% in healthy adults, meta-analysis confirms",
    summary: "Pooling 38 long-horizon studies, researchers report 96.4% survival at 15 years for healthy non-smokers — closing the gap with the 20-year data published in 2024.",
    cats: ['Clinical'], reads: 590 },
  { id: 10, source: 'Inside Dentistry', mark: 'ID', time: '11h ago', headline: "Teledentistry billing parity bill clears California Senate committee 8–2",
    summary: "SB-412 would require commercial payers to reimburse synchronous teledentistry visits at parity with in-office consultations. The bill heads to the full Senate next week.",
    cats: ['Regulations','Business'], reads: 412 },
];

const CATEGORIES = ['Technology','Hygiene','Products','Regulations','Clinical','Business','Mainstream'];
const CAT_CLASS = { Technology: 'cat-tech', Hygiene: 'cat-hygiene', Products: 'cat-products', Regulations: 'cat-regulations', Clinical: 'cat-clinical', Business: 'cat-business', Mainstream: 'cat-mainstream' };

const DENTAL_JOKES = [
  { q: "Why did the dentist break up with the manicurist?",            a: "They kept fighting tooth and nail." },
  { q: "What did the dentist say to the golfer?",                      a: "You have a hole in one." },
  { q: "Why did the tree go to the dentist?",                          a: "To get a root canal." },
  { q: "What's a dentist's favorite musical instrument?",              a: "A tuba toothpaste." },
  { q: "Why did the Buddhist refuse Novocain during a root canal?",    a: "He wanted to transcend dental medication." },
  { q: "What do you call a dentist who doesn't like tea?",             a: "Denis." },
  { q: "Why did the dentist become a baseball coach?",                 a: "Because they knew about the importance of a good pitch." },
];

const QUICK_PROMPTS = [
  "Show me today's top stories",
  "Any news about new dental technology?",
  "Summarize regulatory changes this week",
  "What's happening in dental hygiene?",
  "Tell me a dental joke",
];

const PERSONALITIES = {
  warm: {
    name: 'DTAgent',
    greeting: "Good morning! ☀️ I'm DTAgent, your DTA news concierge. We've got 92 fresh stories from your 11 sources today — including a big ADA infection-control update. Want me to walk you through the highlights, or is there something specific on your mind?",
    sample: "Great question! There are two stories worth your attention here. The ADA dropped a 14-page infection-control refresh this morning — main change is mandatory N95 during aerosol procedures starting July 1. And on the tech side, VistaCheck just got FDA clearance for AI caries detection. Want the deeper dive on either one?",
  },
  dry: {
    name: 'DTAgent',
    greeting: "DTAgent here. 92 stories ingested overnight. Headliner: ADA infection-control update — yes, another one. Where would you like to start?",
    sample: "Two relevant items. ADA infection-control update (mandatory N95, July 1). FDA clearance for VistaCheck's caries-detection AI. Both consequential. Pick one and I'll go deeper.",
  },
  newsroom: {
    name: 'DTAgent',
    greeting: "Top of the morning. 92 stories on the wire. Lead today: ADA's infection-control rewrite — N95 mandate kicks in July 1. Tech beat is hot too. What do you want to chase?",
    sample: "Two leads on this one. Lead A: ADA infection-control overhaul — N95 mandatory July 1, 14 pages, supersedes eight prior advisories. Lead B: VistaCheck FDA clearance — 94% sensitivity, three vendors lined up for Q4 integration. Pick a lane.",
  },
};

// expose globals
Object.assign(window, { Icon, TODAY, SOURCES, ARTICLES, CATEGORIES, CAT_CLASS, QUICK_PROMPTS, PERSONALITIES, DENTAL_JOKES });
