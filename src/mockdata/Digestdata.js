export const ARTICLES = [
  {
    id: 1, source: "ADA News", sourceKey: "ADA", time: "2h ago",
    cats: ["REGULATIONS", "CLINICAL"],
    title: "ADA releases updated infection-control guidance for 2026 in response to evolving aerosol research",
    desc: "The American Dental Association has issued revised infection-control protocols emphasizing high-volume evacuation and N95 use during aerosol-generating procedures. The 14-page update consolidates eight separate advisories from the past three years and takes effect July 1, 2026.",
    trending: true,
  },
  {
    id: 2, source: "Inside Dentistry", sourceKey: "ID", time: "3h ago",
    cats: ["TECHNOLOGY", "CLINICAL"],
    title: "AI-assisted caries detection clears 510(k) hurdle, expected in chairside units by Q4",
    desc: "VistaCheck's deep-learning module received FDA clearance after a 12,000-image multi-site study showed 94% sensitivity for proximal lesions. Three major chairside imaging vendors have signaled integration plans before the end of the year.",
    trending: true,
  },
  {
    id: 3, source: "DentistryIQ", sourceKey: "DIQ", time: "4h ago",
    cats: ["HYGIENE", "BUSINESS"],
    title: "Survey: 62% of hygienists report burnout symptoms, up six points year-over-year",
    desc: "RDH Magazine's annual workforce survey of 4,200 dental hygienists shows the steepest year-over-year burnout climb on record. Schedule density and ergonomic strain top the list of contributing factors, ahead of compensation.",
    trending: true,
  },
  {
    id: 4, source: "Dental Products Hopper", sourceKey: "DPH", time: "5h ago",
    cats: ["PRODUCTS", "TECHNOLOGY"],
    title: "3Shape ships TRIOS 6 with on-scanner AI bite analysis and Wi-Fi 7",
    desc: "The newest TRIOS adds a real-time occlusion heat-map and a 30% faster scan path. Pricing starts at $34,500 with trade-in credit for existing TRIOS 4/5 units; first deliveries are scheduled for late June.",
    trending: true,
  },
  {
    id: 5, source: "Decisions in Dentistry", sourceKey: "DiD", time: "6h ago",
    cats: ["CLINICAL", "REGULATIONS"],
    title: "Silver diamine fluoride coverage expands to 24 state Medicaid programs",
    desc: "A Pew Trust analysis published this morning shows SDF reimbursement now reaches 24 state programs, up from 17 last year. Pediatric utilization in covered states is averaging 3.4× pre-coverage rates.",
    trending: true,
  },
];

export const TRENDING_CATS = [
  { name: "CLINICAL",    count: 5, style: "text-pink-700 border-pink-300 bg-pink-50" },
  { name: "REGULATIONS", count: 4, style: "text-violet-700 border-violet-300 bg-violet-50" },
  { name: "BUSINESS",    count: 4, style: "text-gray-700 border-gray-300 bg-gray-100" },
  { name: "TECHNOLOGY",  count: 2, style: "text-blue-700 border-blue-300 bg-blue-50" },
  { name: "HYGIENE",     count: 2, style: "text-teal-700 border-teal-300 bg-teal-50" },
  { name: "PRODUCTS",    count: 1, style: "text-amber-700 border-amber-300 bg-amber-50" },
  { name: "MAINSTREAM",  count: 0, style: "text-gray-400 border-gray-200 bg-gray-50" },
];

export const TOP_SOURCES = [
  { name: "Inside Dentistry",       count: 2 },
  { name: "ADA News",               count: 1 },
  { name: "DentistryIQ",            count: 1 },
  { name: "Dental Products Hopper", count: 1 },
  { name: "Decisions in Dentistry", count: 1 },
];

export const CAT_STYLES = {
  REGULATIONS: "text-violet-700 border-violet-300 bg-violet-50",
  CLINICAL:    "text-pink-700 border-pink-300 bg-pink-50",
  TECHNOLOGY:  "text-blue-700 border-blue-300 bg-blue-50",
  HYGIENE:     "text-teal-700 border-teal-300 bg-teal-50",
  BUSINESS:    "text-gray-700 border-gray-300 bg-gray-100",
  PRODUCTS:    "text-amber-700 border-amber-300 bg-amber-50",
  MAINSTREAM:  "text-gray-400 border-gray-200 bg-gray-50",
};