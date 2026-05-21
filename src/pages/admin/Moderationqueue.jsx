import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MockData } from "../../mockdata/moderationmockData";
import All from "../admin/morderationTabs/All"
import Live from "../admin/morderationTabs/Live"
import Remove from "../admin/morderationTabs/Remove"

const ModerationQueue = () => {
  const liveCount    = MockData.filter(d => d.status === "live").length;
  const removedCount = MockData.filter(d => d.status === "removed").length;

  return (
    <div className="p-6">
      <Tabs defaultValue="all">
        <TabsList className="bg-transparent border-b border-gray-200 rounded-none w-full justify-start gap-0 h-auto p-0 mb-4">
          <TabsTrigger value="all"     className="cursor-pointer rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-4 pb-2.5 text-[14px]">
            All ({MockData.length})
          </TabsTrigger>
          <TabsTrigger value="live"    className="cursor-pointer  rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-4 pb-2.5 text-[14px]">
            Live ({liveCount})
          </TabsTrigger>
          <TabsTrigger value="removed" className="cursor-pointer  rounded-none border-l-0 border-t-0 border-r-0 border-b-2 border-transparent data-[state=active]:border-gray-900 data-[state=active]:bg-transparent px-4 pb-2.5 text-[14px]">
            Removed ({removedCount})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all"><All /></TabsContent>
        <TabsContent value="live"><Live /></TabsContent>
        <TabsContent value="removed"><Remove /></TabsContent>
      </Tabs>
    </div>
  );
};

export default ModerationQueue;