import ArticleList from "./ArticleList";
import { MockData } from "../../../mockdata/moderationmockData";
const Live = () => <div className="p-6"><ArticleList data={MockData.filter(d => d.status === "live")} /></div>;
export default Live;