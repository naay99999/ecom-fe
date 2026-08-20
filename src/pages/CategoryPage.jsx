import { useParams } from "react-router";

export default function CategoryPage() {
  const { slug } = useParams();
  return <h1>Category: {slug}</h1>;
}
