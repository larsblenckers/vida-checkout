const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { athleteName, athleteSport } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'us_bank_account', 'affirm', 'cashapp', 'google_pay'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            product: 'prod_S3zqjYvIlnzzQi',
            unit_amount: 250000,
            currency: 'usd'
          },
          quantity: 1,
        },
      ],
      custom_fields: [
        {
          key: 'athlete_name',
          label: { type: 'custom', custom: 'Athlete Name' },
          type: 'text',
          required: true
        },
        {
          key: 'athlete_sport',
          label: { type: 'custom', custom: 'Athlete Sport' },
          type: 'text',
          required: true
        }
      ],
      success_url: 'https://vidasports.webflow.io/success',
      cancel_url: 'https://vidasports.webflow.io/cancel'
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));