import { getOrdersByHub, mockOrders } from "~/lib/data/orders";

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const hub = url.searchParams.get("hub");
  const data = hub ? getOrdersByHub(hub) : mockOrders;
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
