// Core Payment Logic Fragment
const confirmOrder = async () => {
  const paymentMode = import.meta.env.VITE_PAYMENT_MODE || 'demo';

  if (paymentMode === 'live') {
    const response = await fetch('/api/payment/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, grossAmount: finalAmount, items })
    });
    const data = await response.json();
    window.snap.pay(data.token, {
      onSuccess: (result) => handleSuccess(result),
      onPending: (result) => handlePending(result),
      onError: (result) => handleFailed(result)
    });
  } else {
    // Demo Mode Simulation
    handleDemoPayment('success', newOrder);
  }
};
