import React from "react";
import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetModerationQueueQuery, useGetDatasourcenamesQuery } from "../../redux/Api/adminModerationApi";
import All from "../admin/morderationTabs/All";
import Live from "../admin/morderationTabs/Live";
import Remove from "../admin/morderationTabs/Remove";

const ModerationQueue = () => {
  const [selectedSource, setSelectedSource] = React.useState("all");
  const [selectedProduct, setSelectedProduct] = React.useState("all");
  const [tab, setTab] = React.useState("all");
  const [page, setPage] = React.useState(1);

  const apiFilters = useMemo(() => {
    const filters = { page_size: 20, page };
    if (selectedSource !== "all") filters.source_name = selectedSource;
    if (selectedProduct !== "all") filters.category = selectedProduct;
    if (tab !== "all") filters.status = tab;
    return filters;
  }, [selectedSource, selectedProduct, tab, page]);

  const { data: moderationqueue, isLoading: isQueueLoading } =
    useGetModerationQueueQuery(apiFilters);
  const { data: sourcenamesData, isLoading: isSourcesLoading } =
    useGetDatasourcenamesQuery();

  const queueResults = useMemo(
    () => moderationqueue?.data?.results || [],
    [moderationqueue]
  );

  const totalCount = moderationqueue?.data?.count || 0;
  const totalPages = useMemo(() => {
    if (!totalCount) return 0;
    return Math.ceil(totalCount / 20);
  }, [totalCount]);

 




  const uniqueCategories = useMemo(() => {
    const cats = new Set();
    queueResults.forEach((item) => {
      item.ai_article_categories?.forEach((c) => cats.add(c));
    });
    return Array.from(cats).sort();
  }, [queueResults]);

  const isLoading = isQueueLoading || isSourcesLoading;
  const error = moderationqueue?.success === false;
  const sourcesError = sourcenamesData?.success === false;

  const sourcenames = sourcesError ? [] : sourcenamesData?.data || [];

  return (
    <div className="p-6">
      <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
        <TabsList className="bg-transparent border-b border-gray-200 rounded-none w-full justify-start gap-0 h-auto p-0 mb-4">
          <TabsTrigger
            value="all"
            className="cursor-pointer rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-4 pb-2.5 text-[14px]"
          >
            All 
          </TabsTrigger>
          <TabsTrigger
            value="live"
            className="cursor-pointer rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-4 pb-2.5 text-[14px]"
          >
            Live 
          </TabsTrigger>
          <TabsTrigger
            value="removed"
            className="cursor-pointer rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-4 pb-2.5 text-[14px]"
          >
            Removed 
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <All
            data={queueResults}
            isLoading={isLoading}
            error={error}
            uniqueCategories={uniqueCategories}
            sourcenames={sourcenames}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </TabsContent>
        <TabsContent value="live">
          <Live
            data={queueResults}
            isLoading={isLoading}
            error={error}
            uniqueCategories={uniqueCategories}
            sourcenames={sourcenames}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </TabsContent>
        <TabsContent value="removed">
          <Remove
            data={queueResults}
            isLoading={isLoading}
            error={error}
            uniqueCategories={uniqueCategories}
            sourcenames={sourcenames}
            selectedSource={selectedSource}
            setSelectedSource={setSelectedSource}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModerationQueue;
