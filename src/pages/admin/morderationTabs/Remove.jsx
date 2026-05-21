import ArticleList from "./ArticleList";
import { MockData } from "../../../mockdata/moderationmockData";
const Remove = () => <div className="p-6"><ArticleList data={MockData.filter(d => d.status === "removed")} /></div>;
export default Remove;