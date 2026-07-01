import ArticleList from "./ArticleList";

const Remove = ({
  data,
  isLoading,
  error,
  uniqueCategories,
  sourcenames,
  selectedSource,
  setSelectedSource,
  selectedProduct,
  setSelectedProduct,
}) => (
  <div className="p-6">
    <ArticleList
      data={data}
      isLoading={isLoading}
      error={error}
      uniqueCategories={uniqueCategories}
      sourcenames={sourcenames}
      selectedSource={selectedSource}
      setSelectedSource={setSelectedSource}
      selectedProduct={selectedProduct}
      setSelectedProduct={setSelectedProduct}
    />
  </div>
);

export default Remove;