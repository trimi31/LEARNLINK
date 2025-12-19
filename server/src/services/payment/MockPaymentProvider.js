const PaymentStrategy = require('./PaymentStrategy');
const { v4: uuidv4 } = require('uuid');

class MockPaymentProvider extends PaymentStrategy {
  async processPayment(amount, currency, metadata) {
    // Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          externalRef: `MOCK-${uuidv4()}`,
          status: 'PAID',
          message: 'Payment processed successfully (MOCK)',
        });
      }, 100);
    });
  }

  async refund(externalRef, amount) {
    // Simulate refund processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          refundRef: `REFUND-${uuidv4()}`,
          status: 'REFUNDED',
          message: 'Refund processed successfully (MOCK)',
        });
      }, 100);
    });
  }

  getProviderName() {
    return 'MOCK';
  }
}

module.exports = MockPaymentProvider;

