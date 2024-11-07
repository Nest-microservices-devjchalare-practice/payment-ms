import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.stripe_secret_key);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;
    const lineItems = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));
    const session = await this.stripe.checkout.sessions.create({
      //Id de orden
      payment_intent_data: {
        metadata: { orderId: orderId },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.stripe_success_url,
      cancel_url: envs.stripe_cancel_url,
    });

    //return session;

    return {
      cancelUrl: session.cancel_url,
      successUrl: session.success_url,
      url: session.url,
    };
  }
}
