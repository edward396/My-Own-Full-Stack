import { getProductById } from "~/lib/data/products";

export async function loader({ params }: { params: { productId: string } }) {
  const product = getProductById(params.productId);
  if (!product) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify(product), {
    headers: { "Content-Type": "application/json" },
  });
}
