// ABBA Collective Transactional Email Service

export async function sendOrderConfirmation({ order, customerEmail }) {
  console.log(`[EmailService] Sending Order Confirmation email for Order #${order.id} to ${customerEmail}`);
  return {
    sent: true,
    messageId: 'msg_ord_' + Date.now(),
    to: customerEmail,
    subject: `Order Confirmation #${order.id} — ABBA Collective`,
  };
}

export async function sendShippingUpdate({ order, status, customerEmail }) {
  console.log(`[EmailService] Sending Shipping Update (${status}) for Order #${order.id} to ${customerEmail}`);
  return {
    sent: true,
    messageId: 'msg_ship_' + Date.now(),
    to: customerEmail,
    subject: `Shipment Update for Order #${order.id}: ${status}`,
  };
}

export async function sendWelcomeEmail({ userEmail, fullName }) {
  console.log(`[EmailService] Sending Welcome email to ${fullName} <${userEmail}>`);
  return {
    sent: true,
    messageId: 'msg_welc_' + Date.now(),
    to: userEmail,
    subject: 'Welcome to ABBA Collective — Identity Received. Grace Revealed.',
  };
}
