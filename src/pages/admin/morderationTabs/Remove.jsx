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
  page,
  setPage,
  totalPages,
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
      page={page}
      setPage={setPage}
      totalPages={totalPages}
    />
  </div>
);

export default Remove;