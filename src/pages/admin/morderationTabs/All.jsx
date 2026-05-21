import ArticleList from "./ArticleList";
import { MockData } from "../../../mockdata/moderationmockData";
const All = () => <div className="p-6"><ArticleList data={MockData} /></div>;
export default All;