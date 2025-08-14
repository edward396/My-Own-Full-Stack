// Mock order data for demonstration
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "pending" | "active" | "delivered" | "cancelled";
  hubId: string;
  hubName: string;
  orderDate: string;
  deliveryDate?: string;
  shipperId?: string;
}

export const mockOrders: Order[] = [
  // ACTIVE ORDERS - Ready for pickup/delivery
  {
    id: "ORD-001",
    customerId: "customer_user123",
    customerName: "Alice Johnson",
    customerAddress: "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
    items: [
      {
        productId: "1",
        productName: "Wireless Bluetooth Headphones",
        quantity: 1,
        price: 89.99,
      },
      {
        productId: "7",
        productName: "Bluetooth Speaker",
        quantity: 1,
        price: 65.0,
      },
    ],
    total: 154.99,
    status: "active",
    hubId: "hub_hcm",
    hubName: "Ho Chi Minh",
    orderDate: "2024-01-15T10:30:00Z",
    shipperId: "shipper_hcm_001",
  },
  {
    id: "ORD-002",
    customerId: "customer_bob456",
    customerName: "Bob Chen",
    customerAddress: "456 Le Loi Boulevard, Hai Chau District, Da Nang",
    items: [
      {
        productId: "3",
        productName: "Stainless Steel Water Bottle",
        quantity: 2,
        price: 32.5,
      },
    ],
    total: 65.0,
    status: "active",
    hubId: "hub_dn",
    hubName: "Da Nang",
    orderDate: "2024-01-15T14:20:00Z",
    shipperId: "shipper_dn_001",
  },
  {
    id: "ORD-003",
    customerId: "customer_charlie789",
    customerName: "Charlie Nguyen",
    customerAddress: "789 Ba Trieu Street, Hoan Kiem District, Hanoi",
    items: [
      {
        productId: "8",
        productName: "Running Shoes",
        quantity: 1,
        price: 95.5,
      },
      {
        productId: "5",
        productName: "Yoga Exercise Mat",
        quantity: 1,
        price: 28.99,
      },
    ],
    total: 124.49,
    status: "active",
    hubId: "hub_hn",
    hubName: "Hanoi",
    orderDate: "2024-01-16T09:15:00Z",
    shipperId: "shipper_hn_001",
  },
  {
    id: "ORD-004",
    customerId: "customer_diana321",
    customerName: "Diana Tran",
    customerAddress: "321 Dong Khoi Street, District 1, Ho Chi Minh City",
    items: [
      {
        productId: "2",
        productName: "Organic Cotton T-Shirt",
        quantity: 3,
        price: 24.99,
      },
    ],
    total: 74.97,
    status: "active",
    hubId: "hub_hcm",
    hubName: "Ho Chi Minh",
    orderDate: "2024-01-16T16:45:00Z",
  },
  {
    id: "ORD-005",
    customerId: "customer_eva654",
    customerName: "Eva Le",
    customerAddress: "654 Tran Hung Dao Street, Hoan Kiem District, Hanoi",
    items: [
      {
        productId: "4",
        productName: "LED Desk Lamp",
        quantity: 1,
        price: 45.0,
      },
    ],
    total: 45.0,
    status: "active",
    hubId: "hub_hn",
    hubName: "Hanoi",
    orderDate: "2024-01-16T20:30:00Z",
    shipperId: "shipper_hn_002",
  },

  // MORE ACTIVE ORDERS - Today's orders needing immediate attention
  {
    id: "ORD-006",
    customerId: "customer_frank888",
    customerName: "Frank Pham",
    customerAddress: "88 Pasteur Street, District 3, Ho Chi Minh City",
    items: [
      {
        productId: "1",
        productName: "Wireless Bluetooth Headphones",
        quantity: 2,
        price: 89.99,
      },
      {
        productId: "4",
        productName: "LED Desk Lamp",
        quantity: 1,
        price: 45.0,
      },
    ],
    total: 224.98,
    status: "active",
    hubId: "hub_hcm",
    hubName: "Ho Chi Minh",
    orderDate: new Date().toISOString(),
    shipperId: "shipper_hcm_002",
  },
  {
    id: "ORD-007",
    customerId: "customer_grace999",
    customerName: "Grace Vo",
    customerAddress: "256 Bach Dang Street, Hai Chau District, Da Nang",
    items: [
      {
        productId: "3",
        productName: "Stainless Steel Water Bottle",
        quantity: 1,
        price: 32.5,
      },
      {
        productId: "5",
        productName: "Yoga Exercise Mat",
        quantity: 2,
        price: 28.99,
      },
    ],
    total: 90.48,
    status: "active",
    hubId: "hub_dn",
    hubName: "Da Nang",
    orderDate: new Date().toISOString(),
  },
  {
    id: "ORD-008",
    customerId: "customer_henry111",
    customerName: "Henry Bui",
    customerAddress: "147 Kim Ma Street, Ba Dinh District, Hanoi",
    items: [
      {
        productId: "8",
        productName: "Running Shoes",
        quantity: 1,
        price: 95.5,
      },
      {
        productId: "2",
        productName: "Organic Cotton T-Shirt",
        quantity: 2,
        price: 24.99,
      },
    ],
    total: 145.48,
    status: "active",
    hubId: "hub_hn",
    hubName: "Hanoi",
    orderDate: new Date().toISOString(),
    shipperId: "shipper_hn_001",
  },

  // PENDING ORDERS - Waiting for pickup assignment
  {
    id: "ORD-009",
    customerId: "customer_iris222",
    customerName: "Iris Hoang",
    customerAddress: "369 Cach Mang Thang Tam Street, District 10, Ho Chi Minh City",
    items: [
      {
        productId: "7",
        productName: "Bluetooth Speaker",
        quantity: 1,
        price: 65.0,
      },
    ],
    total: 65.0,
    status: "pending",
    hubId: "hub_hcm",
    hubName: "Ho Chi Minh",
    orderDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: "ORD-010",
    customerId: "customer_jack333",
    customerName: "Jack Do",
    customerAddress: "741 Hoang Dieu Street, Hai Chau District, Da Nang",
    items: [
      {
        productId: "4",
        productName: "LED Desk Lamp",
        quantity: 2,
        price: 45.0,
      },
      {
        productId: "3",
        productName: "Stainless Steel Water Bottle",
        quantity: 1,
        price: 32.5,
      },
    ],
    total: 122.5,
    status: "pending",
    hubId: "hub_dn",
    hubName: "Da Nang",
    orderDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
  },
  {
    id: "ORD-011",
    customerId: "customer_kelly444",
    customerName: "Kelly Truong",
    customerAddress: "852 Giang Vo Street, Ba Dinh District, Hanoi",
    items: [
      {
        productId: "1",
        productName: "Wireless Bluetooth Headphones",
        quantity: 1,
        price: 89.99,
      },
      {
        productId: "5",
        productName: "Yoga Exercise Mat",
        quantity: 1,
        price: 28.99,
      },
    ],
    total: 118.98,
    status: "pending",
    hubId: "hub_hn",
    hubName: "Hanoi",
    orderDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
  },

  // DELIVERED ORDERS - Recently completed
  {
    id: "ORD-012",
    customerId: "customer_leon555",
    customerName: "Leon Mai",
    customerAddress: "963 Nguyen Trai Street, District 5, Ho Chi Minh City",
    items: [
      {
        productId: "2",
        productName: "Organic Cotton T-Shirt",
        quantity: 4,
        price: 24.99,
      },
    ],
    total: 99.96,
    status: "delivered",
    hubId: "hub_hcm",
    hubName: "Ho Chi Minh",
    orderDate: "2024-01-14T14:30:00Z",
    deliveryDate: "2024-01-15T16:45:00Z",
    shipperId: "shipper_hcm_001",
  },
  {
    id: "ORD-013",
    customerId: "customer_maria666",
    customerName: "Maria Tran",
    customerAddress: "159 Yen Bai Street, Hai Chau District, Da Nang",
    items: [
      {
        productId: "8",
        productName: "Running Shoes",
        quantity: 1,
        price: 95.5,
      },
    ],
    total: 95.5,
    status: "delivered",
    hubId: "hub_dn",
    hubName: "Da Nang",
    orderDate: "2024-01-13T10:20:00Z",
    deliveryDate: "2024-01-14T12:30:00Z",
    shipperId: "shipper_dn_001",
  },
  {
    id: "ORD-014",
    customerId: "customer_nick777",
    customerName: "Nick Vu",
    customerAddress: "753 Thai Ha Street, Dong Da District, Hanoi",
    items: [
      {
        productId: "7",
        productName: "Bluetooth Speaker",
        quantity: 2,
        price: 65.0,
      },
      {
        productId: "4",
        productName: "LED Desk Lamp",
        quantity: 1,
        price: 45.0,
      },
    ],
    total: 175.0,
    status: "delivered",
    hubId: "hub_hn",
    hubName: "Hanoi",
    orderDate: "2024-01-12T16:15:00Z",
    deliveryDate: "2024-01-13T18:20:00Z",
    shipperId: "shipper_hn_002",
  },

  // HIGH-VALUE ORDERS - Priority deliveries
  {
    id: "ORD-015",
    customerId: "customer_oliver888",
    customerName: "Oliver Nguyen",
    customerAddress: "456 Vo Van Tan Street, District 3, Ho Chi Minh City",
    items: [
      {
        productId: "1",
        productName: "Wireless Bluetooth Headphones",
        quantity: 3,
        price: 89.99,
      },
      {
        productId: "7",
        productName: "Bluetooth Speaker",
        quantity: 2,
        price: 65.0,
      },
      {
        productId: "8",
        productName: "Running Shoes",
        quantity: 1,
        price: 95.5,
      },
    ],
    total: 495.47,
    status: "active",
    hubId: "hub_hcm",
    hubName: "Ho Chi Minh",
    orderDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    shipperId: "shipper_hcm_001",
  },
  {
    id: "ORD-016",
    customerId: "customer_paula999",
    customerName: "Paula Le",
    customerAddress: "789 An Thuong 4 Street, Ngu Hanh Son District, Da Nang",
    items: [
      {
        productId: "5",
        productName: "Yoga Exercise Mat",
        quantity: 5,
        price: 28.99,
      },
      {
        productId: "3",
        productName: "Stainless Steel Water Bottle",
        quantity: 3,
        price: 32.5,
      },
    ],
    total: 242.45,
    status: "active",
    hubId: "hub_dn",
    hubName: "Da Nang",
    orderDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    shipperId: "shipper_dn_002",
  },

  // CANCELLED ORDERS - For reference
  {
    id: "ORD-017",
    customerId: "customer_quinn000",
    customerName: "Quinn Dang",
    customerAddress: "321 Cau Giay Street, Cau Giay District, Hanoi",
    items: [
      {
        productId: "2",
        productName: "Organic Cotton T-Shirt",
        quantity: 2,
        price: 24.99,
      },
    ],
    total: 49.98,
    status: "cancelled",
    hubId: "hub_hn",
    hubName: "Hanoi",
    orderDate: "2024-01-10T08:45:00Z",
  },
];

export const getOrdersByHub = (hubName: string): Order[] => {
  return mockOrders.filter(
    (order) => order.hubName === hubName && order.status === "active"
  );
};

export const getOrderById = (id: string): Order | undefined => {
  return mockOrders.find((order) => order.id === id);
};

export const updateOrderStatus = (
  orderId: string,
  status: Order["status"]
): boolean => {
  const orderIndex = mockOrders.findIndex((order) => order.id === orderId);
  if (orderIndex !== -1) {
    mockOrders[orderIndex].status = status;
    if (status === "delivered") {
      mockOrders[orderIndex].deliveryDate = new Date().toISOString();
    }
    return true;
  }
  return false;
};
