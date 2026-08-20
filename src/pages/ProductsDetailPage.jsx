import { useParams } from "react-router";

export default function ProductsDetailPage() {
  const { productId } = useParams();
  return <h1>Product: {productId}</h1>;
}
