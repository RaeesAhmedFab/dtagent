import { createContext, useContext, useState } from "react";

const DigestFilterContext = createContext({ activeFilters: [], setActiveFilters: () => {} });

export const DigestFilterProvider = ({ children }) => {
  const [activeFilters, setActiveFilters] = useState([]);
  return (
    <DigestFilterContext.Provider value={{ activeFilters, setActiveFilters }}>
      {children}
    </DigestFilterContext.Provider>
  );
};

export const useDigestFilter = () => useContext(DigestFilterContext);