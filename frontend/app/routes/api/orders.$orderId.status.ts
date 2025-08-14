import { updateOrderStatus } from "~/lib/data/orders";

export async function action({
  params,
  request,
}: {
  params: { orderId: string };
  request: Request;
}) {
  const body = await request.json().catch(() => ({}));
  const status = body?.status;
  if (status !== "delivered" && status !== "cancelled") {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid status" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  const ok = updateOrderStatus(params.orderId, status);
  return new Response(JSON.stringify({ success: ok }), {
    headers: { "Content-Type": "application/json" },
  });
}
