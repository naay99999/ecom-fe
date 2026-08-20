import { useParams } from "react-router";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  return <h1>Order: {orderId}</h1>;
}
