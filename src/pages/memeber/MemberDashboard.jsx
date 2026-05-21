import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import TodaysSnapshot from "../../components/TodaysSnapshot";
import All from "./tabs/All";
import Trending from "./tabs/Trending";
import ArticleDetail from "./ArticleDetail"; 
import { ARTICLES } from "../../mockdata/Digestdata"; 

const MemberDashboard = () => {
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);

  const handleBack = (article) => {
    if (article && article.id) setDetail(article);
    else setDetail(null);
  };

  return (
    <>
      {!detail && <TodaysSnapshot />}

      <div className="p-4 md:p-6">
        {detail ? (
          <ArticleDetail article={detail} onBack={handleBack} />
        ) : (
          <Tabs defaultValue="all">

            {/* Tab bar + search */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-5 gap-3">
              <TabsList className="bg-transparent border-b border-gray-200 rounded-none justify-start gap-0 h-auto p-0 w-full md:w-auto">
                <TabsTrigger
                  value="all"
                  className="cursor-pointer rounded-none border-l-0 border-r-0 border-t-0 border-b-2 border-transparent
                    data-[state=active]:border-[#0f2d5c] data-[state=active]:bg-transparent
                    data-[state=active]:text-[#0f2d5c] data-[state=active]:font-semibold
                    px-4 pb-2.5 text-[14px]"
                >
                  All{" "}
                  <span className="ml-1.5 bg-[#0f2d5c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {ARTICLES.length}
                  </span>
                </TabsTrigger>

                <TabsTrigger
                  value="trending"
                  className="cursor-pointer rounded-none border-l-0 border-r-0 border-t-0 border-b-2 border-transparent
                    data-[state=active]:border-[#0f2d5c] data-[state=active]:bg-transparent
                    data-[state=active]:text-[#0f2d5c] data-[state=active]:font-semibold
                    px-4 pb-2.5 text-[14px]"
                >
                  Trending{" "}
                  <span className="ml-1.5 text-gray-500 text-[14px]">
                    {ARTICLES.filter(a => a.trending).length}
                  </span>
                </TabsTrigger>
              </TabsList>

              {/* Search */}
              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 gap-2 bg-white w-full md:min-w-[260px] md:w-auto">
                <Search size={13} className="text-gray-400 flex-shrink-0" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search today's digest…"
                  className="border-none shadow-none p-0 h-auto text-[13px] focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Tab content */}
            <TabsContent value="all">
              <All search={search} onArticleClick={setDetail} />
            </TabsContent>

            <TabsContent value="trending">
              <Trending search={search} onArticleClick={setDetail} />
            </TabsContent>

          </Tabs>
        )}
      </div>
    </>
  );
};

export default MemberDashboard;