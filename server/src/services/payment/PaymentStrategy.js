// Payment Strategy Interface
class PaymentStrategy {
  async processPayment(amount, currency, metadata) {
    throw new Error('processPayment must be implemented');
  }

  async refund(externalRef, amount) {
    throw new Error('refund must be implemented');
  }

  getProviderName() {
    throw new Error('getProviderName must be implemented');
  }
}

module.exports = PaymentStrategy;

