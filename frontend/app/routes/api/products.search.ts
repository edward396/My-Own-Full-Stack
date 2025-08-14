import { searchProducts } from "~/lib/data/products";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || undefined;
  const min = url.searchParams.get("min");
  const max = url.searchParams.get("max");
  const category = url.searchParams.get("category") || undefined;

  const results = searchProducts(
    q,
    min ? Number(min) : undefined,
    max ? Number(max) : undefined,
    category
  );

  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
  });
}
