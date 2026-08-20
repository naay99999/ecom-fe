import { useParams } from "react-router";

export default function HomePage() {
  const { slug } = useParams();
  return <h1>Home: {slug}</h1>;
}

