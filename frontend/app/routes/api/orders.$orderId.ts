import { getOrderById } from "~/lib/data/orders";

export async function loader({ params }: { params: { orderId: string } }) {
  const order = getOrderById(params.orderId);
  if (!order) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify(order), {
    headers: { "Content-Type": "application/json" },
  });
}
