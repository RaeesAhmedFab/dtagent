import { Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
const articles = [
  {
    categories: [
      { label: "REGULATIONS", style: "text-violet-600 border-violet-300 bg-violet-50" },
      { label: "CLINICAL",    style: "text-pink-700 border-pink-300 bg-pink-50" },
    ],
    title: "ADA releases updated infection-control guidance for 2026 in response to evolving aerosol research",
    desc:  "The American Dental Association has issued revised infection-control protocols emphasizing high-volume evacuation and N95 use during aerosol-generating procedures. The 14-page update consolidates eight separate advisories from the past three years and takes effect July 1, 2026.",
  },
  {
    categories: [
      { label: "TECHNOLOGY", style: "text-cyan-700 border-cyan-300 bg-cyan-50" },
      { label: "CLINICAL",   style: "text-pink-700 border-pink-300 bg-pink-50" },
    ],
    title: "AI-assisted caries detection clears 510(k) hurdle, expected in chairside units by Q4",
    desc:  "VistaCheck's deep-learning module received FDA clearance after a 12,000-image multi-site study showed 94% sensitivity for proximal lesions. Three major chairside imaging vendors have signaled integration plans before the end of the year.",
  },
  {
    categories: [
      { label: "HYGIENE",  style: "text-teal-700 border-teal-300 bg-teal-50" },
      { label: "BUSINESS", style: "text-gray-700 border-gray-300 bg-gray-50" },
    ],
    title: "Survey: 62% of hygienists report burnout symptoms, up six points year-over-year",
    desc:  "RDH Magazine's annual workforce survey of 4,200 dental hygienists shows the steepest year-over-year burnout climb on record. Schedule density and ergonomic strain top the list of contributing factors, ahead of compensation.",
  },
];

const EmailTemplatePreview = () => {
  return (
  <Card>
    <div className="min-h-screen p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-lg font-blod text-gray-800">Email template preview</span>
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Settings size={14} /> Edit template
        </Button>
      </div>

      {/* Email card */}
      <div className="max-w-[500px] mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* Blue header */}
        <div className="bg-[#1b4b8a] px-6 py-5">
          <p className="text-[20px] font-bold text-white mb-1 leading-snug">Your dental brief — May 6</p>
          <p className="text-[11px] text-blue-200 tracking-widest">FROM DTAGENT · DENTALTRADEALLIANCE.ORG</p>
        </div>

        {/* Articles */}
        <div className="px-6 py-5">
          {articles.map((article, index) => (
            <div key={index}>
              <div className="flex gap-1.5 flex-wrap mb-2">
                {article.categories.map((cat) => (
                  <span key={cat.label} className={`text-[11px] font-semibold border rounded px-2 py-0.5 ${cat.style}`}>
                    {cat.label}
                  </span>
                ))}
              </div>
              <p className="text-[14px] font-semibold text-gray-900 mb-1.5 leading-snug">{article.title}</p>
              <p className="text-[13px] text-gray-500 leading-relaxed">{article.desc}</p>
              {index < articles.length - 1 && <Separator className="my-4" />}
            </div>
          ))}

          {/* CTA */}
          <div className="text-center mt-6">
            <button className="bg-[#1b4b8a] hover:bg-[#163d72] text-white text-[14px] font-medium px-7 py-2.5 rounded-lg">
              Open today's digest →
            </button>
          </div>
        </div>
      </div>
    </div>
    </Card>
  );
};

export default EmailTemplatePreview;