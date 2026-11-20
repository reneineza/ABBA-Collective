// ABBA Payment Architecture for Rwanda
// Providers: MTN MoMo, Airtel Money, and Visa/Mastercard cards.
// These are demo stubs; connect each provider to a live gateway (e.g. the MTN MoMo
// Collections API, Airtel Money API, or an aggregator covering all three) before launch.

export async function createPayment({ orderId, provider, amount, currency = 'RWF', customerEmail, phoneNumber }) {
  console.log(`[PaymentService] Initializing ${provider} transaction for Order #${orderId} - Amount: ${amount} ${currency}`);

  const transactionId = 'tx_' + provider.toLowerCase().replace(/ /g, '') + '_' + Date.now();

  if (provider === 'MTN MoMo' || provider === 'Airtel Money') {
    return {
      success: true,
      transactionId,
      provider,
      phoneNumber,
      status: 'Completed',
      message: `${provider} payment prompt sent to ${phoneNumber}.`,
    };
  }

  // Default Card (Visa / Mastercard) / Demo
  return {
    success: true,
    transactionId,
    provider: provider || 'Card',
    status: 'Completed',
    message: 'Card payment processed securely.',
  };
}

export async function verifyPayment({ transactionId, provider }) {
  return {
    verified: true,
    transactionId,
    provider,
    status: 'Completed',
  };
}

export async function refundPayment({ paymentId, amount, reason }) {
  return {
    refunded: true,
    paymentId,
    amount,
    status: 'Refunded',
    reason: reason || 'Customer requested return',
  };
}
