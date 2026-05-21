import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw, Trash2, Check, Filter, Sparkles } from "lucide-react";

const categoryStyles = {
  REGULATIONS: "text-violet-700 border-violet-300",
  CLINICAL: "text-pink-700 border-pink-300",
  TECHNOLOGY: "text-blue-700 border-blue-300",
  HYGIENE: "text-teal-700 border-teal-300",
  BUSINESS: "text-gray-700 border-gray-300",
  PRODUCTS: "text-amber-700 border-amber-300",
};

const StatusBadge = ({ status }) =>
  status === "live" ? (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-green-800 bg-green-100 rounded-full px-2.5 py-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-rose-700 bg-rose-100 rounded-full px-2.5 py-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Removed
    </span>
  );

const ArticleList = ({ data }) => (
  <Card className="w-full">
    <CardContent className="flex justify-between items-center pt-5 pb-4 px-5 flex-wrap gap-3">
      <p className="text-[15px] font-semibold text-gray-800">Articles ingested in the past 48 hours</p>
      <div className="flex items-center flex-wrap gap-2">
        <Select defaultValue="all-sources">
          <SelectTrigger className="w-[140px] h-9 text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-sources">All sources</SelectItem>
            <SelectItem value="inside-dentistry">
              Inside Dentistry
            </SelectItem>

            <SelectItem value="inside-dental-hygiene">
              Inside Dental Hygiene
            </SelectItem>
            <SelectItem value="conexiant-dental">
              Conexiant Dental
            </SelectItem>

            <SelectItem value="ada-news">
              ADA News
            </SelectItem>

            <SelectItem value="the-dental-advisor">
              The Dental Advisor
            </SelectItem>

            <SelectItem value="dimensions-of-dental-hyg">
              Dimensions of Dental Hyg.
            </SelectItem>

            <SelectItem value="decisions-in-dentistry">
              Decisions in Dentistry
            </SelectItem>

            <SelectItem value="dentistryiq">
              DentistryIQ
            </SelectItem>

            <SelectItem value="dental-tribune-us">
              Dental Tribune US
            </SelectItem>

            <SelectItem value="dental-products-hopper">
              Dental Products Hopper
            </SelectItem>

            <SelectItem value="drbicuspid">
              DrBicuspid.com
            </SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="products">
          <SelectTrigger className="w-[140px] h-9 text-[13px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">
              All categories
            </SelectItem>

            <SelectItem value="technology">
              Technology
            </SelectItem>

            <SelectItem value="hygiene">
              Hygiene
            </SelectItem>

            <SelectItem value="products">
              Products
            </SelectItem>

            <SelectItem value="regulations">
              Regulations
            </SelectItem>

            <SelectItem value="clinical">
              Clinical
            </SelectItem>

            <SelectItem value="business">
              Business
            </SelectItem>

            <SelectItem value="mainstream">
              Mainstream
            </SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="h-9 text-[13px] gap-1.5">
          <Filter size={13} /> More filters
        </Button>
      </div>
    </CardContent>

    <Separator />

    <CardContent className="p-0">
      {data.map((item, index) => (
        <div key={index}>
          <div className="flex flex-col md:grid gap-5 px-5 py-5" style={{ gridTemplateColumns: "140px 1fr auto" }}>
            <div>
              <p className="text-[13px] font-semibold text-gray-800 mb-0.5">{item.source}</p>
              <p className="text-[12px] text-gray-400 mb-2.5">{item.time}</p>
              <div className="flex flex-row md:flex-col gap-1.5 flex-wrap">
                {item.cats.map((cat) => (
                  <span key={cat} className={`text-[11px] font-semibold border rounded px-2 py-0.5 w-fit ${categoryStyles[cat]}`}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[14px] font-semibold text-gray-900 mb-1.5 leading-snug">{item.title}</p>
              <p className="text-[13px] text-gray-500 mb-2.5 leading-relaxed">{item.desc}</p>
              <div className="flex items-center gap-2 text-[12px] text-gray-400 flex-wrap">
                <span className="inline-flex items-center gap-1"><Sparkles size={12} /> AI summary · GPT-4</span>
                <span>·</span><span>{item.reads} reads</span><span>·</span>
                <StatusBadge status={item.status} />
              </div>
            </div>
            <div className="flex flex-row md:flex-col items-start gap-1.5 pt-0.5 mt-3 md:mt-0">
              <button className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-md px-2.5 py-1.5 hover:bg-gray-50 whitespace-nowrap">
                <Eye size={13} /> Preview
              </button>
              <button className="inline-flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-md px-2.5 py-1.5 hover:bg-gray-50 whitespace-nowrap">
                <RefreshCw size={13} /> Regenerate
              </button>
              {item.status === "removed" ? (
                <button className="inline-flex items-center gap-1.5 text-[12px] text-gray-400 border border-gray-200 rounded-md px-2.5 py-1.5 whitespace-nowrap">
                  <Check size={13} /> Restore
                </button>
              ) : (
                <button className="inline-flex items-center gap-1.5 text-[12px] text-red-600 border border-red-200 rounded-md px-2.5 py-1.5 bg-red-50 hover:bg-red-100 whitespace-nowrap">
                  <Trash2 size={13} /> Remove
                </button>
              )}
            </div>
          </div>
          {index < data.length - 1 && <Separator />}
        </div>
      ))}
    </CardContent>
  </Card>
);

export default ArticleList;