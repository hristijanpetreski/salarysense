import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";

export default function Home() {
  return (
    <main class="grid place-content-center h-full">
      <Title>Initial commit</Title>
      <Counter />
    </main>
  );
}
