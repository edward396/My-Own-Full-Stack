import { mockProducts } from "~/lib/data/products";

export async function loader() {
  return new Response(JSON.stringify(mockProducts), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function action({ request }: { request: Request }) {
  if (request.method === "POST") {
    // Simulate creating a product
    await request.json().catch(() => ({}));
    return new Response(
      JSON.stringify({ success: true, id: String(Date.now()) }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return new Response(JSON.stringify({ error: "Invalid method" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
