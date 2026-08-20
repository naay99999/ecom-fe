import { useSearchParams } from "react-router";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  return <h1>Search Results: {query}</h1>;
}
