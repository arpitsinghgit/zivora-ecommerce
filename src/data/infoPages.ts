export interface InfoPageData {
  title: string;
  subtitle?: string;
  content: string; // Markdown or HTML string
}

export const infoPagesData: Record<string, InfoPageData> = {
  // Sizing & Fitting
  'sizing-chart': {
    title: 'Press-On Sizing Chart',
    subtitle: 'Find your perfect fit with our universal sizing guide.',
    content: `
### Universal Sizing Guide
Our press-on nails come in standard sizes: Extra Small (XS), Small (S), Medium (M), and Large (L). Each set includes 30 nails to ensure you find the perfect match for every finger.

**Thumb / Index / Middle / Ring / Pinky (in mm)**
- **XS**: 14mm / 10mm / 11mm / 10mm / 7mm
- **S**: 15mm / 11mm / 12mm / 11mm / 8mm
- **M**: 16mm / 12mm / 13mm / 12mm / 9mm
- **L**: 18mm / 13mm / 14mm / 13mm / 10mm

If you are between sizes, we recommend sizing up and gently filing the edges for a custom fit.
    `
  },
  'how-to-measure': {
    title: 'How to Measure Nails',
    subtitle: 'A simple guide to measuring your natural nails at home.',
    content: `
### Measuring at Home
1. Place a piece of clear tape over your nail.
2. Press down on the edges to account for the curve of your nail bed.
3. Use a fine-tip pen to mark the widest points of your nail.
4. Remove the tape and measure the distance between the lines with a ruler (in millimeters).
5. Compare your measurements to our [Sizing Chart](/page/sizing-chart).
    `
  },
  'application-removal': {
    title: 'Application & Removal',
    subtitle: 'Expert techniques for 14-day wear and damage-free removal.',
    content: `
### Flawless Application
1. **Prep**: Push back cuticles and gently buff the nail surface. Wipe clean with the provided alcohol pad.
2. **Select**: Choose the correct size for each finger.
3. **Apply**: Apply a thin layer of nail glue to your natural nail and the back of the press-on.
4. **Press**: Align the press-on with your cuticle and press down firmly for 15 seconds.

### Gentle Removal
1. Soak your hands in warm, soapy water with a few drops of cuticle oil for 10-15 minutes.
2. Gently lift the edges of the press-on with the wooden stick provided. Do not force it.
3. If stubborn, apply more oil and soak for an additional 5 minutes.
    `
  },
  'free-sizing-kit': {
    title: 'Free Sizing Kit Program',
    subtitle: 'Take the guesswork out of sizing.',
    content: `
### Request Your Free Sizing Kit
Not sure about your measurements? We offer a complimentary sizing kit to all new customers. The kit includes blank sample nails in every size so you can find your exact fit before ordering a custom set.

Just pay for shipping, and we'll credit the shipping cost toward your first press-on order!
    `
  },

  // Support & FAQs
  'faqs': {
    title: 'Support & FAQs',
    subtitle: "Everything you need to know about Zivora.",
    content: `
### Frequently Asked Questions

**Are the nails reusable?**
Yes! With proper care and our gentle removal technique, our press-on nails can be worn up to 5 times.

**How long does the gel polish take to cure?**
Our HEMA-Free Gel Polishes cure in just 60 seconds under our Smart LED Lamp.

**Are your products cruelty-free?**
Absolutely. We are proud to be Leaping Bunny certified. None of our products or ingredients are tested on animals.
    `
  },
  'shipping': {
    title: 'Shipping & Customs',
    subtitle: 'Global delivery details and timelines.',
    content: `
### Shipping Timelines
- **Standard Domestic (India)**: 3-5 business days (Free over ₹999)
- **Express Domestic**: 1-2 business days (₹120)
- **International Shipping**: 7-14 business days. Customs duties and taxes may apply depending on your country.

All orders are processed and shipped within 24 hours of placement.
    `
  },
  'returns': {
    title: 'Return Policy',
    subtitle: 'Our 30-day satisfaction guarantee.',
    content: `
### Return & Exchange Policy
Due to hygiene reasons, we cannot accept returns on opened press-on nail sets or used gel polishes. 

However, if your items arrive damaged or defective, please contact us within 30 days of receipt, and we will issue a full refund or replacement. 

Unopened products in their original packaging can be returned within 30 days for a full refund (minus shipping costs).
    `
  },
  'support-ticket': {
    title: 'Submit a Support Ticket',
    subtitle: "We're here to help.",
    content: `
### Contact Customer Care
Need assistance with an order, sizing, or application? Our Nail Technicians and Customer Care team are available Monday through Friday, 9 AM to 6 PM IST.

Please email us at **support@zivora.in** or use the live chat feature in the bottom right corner of the screen. We aim to respond to all inquiries within 24 hours.
    `
  },

  // Brand Sanctuary
  'about': {
    title: "About Zivora",
    subtitle: 'Elevating the at-home manicure experience.',
    content: `
### Our Story
Founded in 2026, Zivora was born from a simple belief: salon-quality manicures shouldn't require salon appointments, harsh chemicals, or hours of your time.

We engineered the ultimate luxury press-on nails and 10-free gel polishes to bring the professional studio experience directly to your vanity. Our products are designed for the modern individual who refuses to compromise on quality, aesthetics, or nail health.
    `
  },
  'leaping-bunny': {
    title: 'Leaping Bunny Certified',
    subtitle: 'Committed to cruelty-free beauty.',
    content: `
### 100% Cruelty-Free
Zivora is proud to be certified by the Leaping Bunny Program, the internationally recognized gold standard for cruelty-free consumer products.

This means that no animal testing is conducted or commissioned for any of our finished products, ingredients, or formulations by us, our laboratories, or our suppliers.
    `
  },
  'carbon-neutral': {
    title: 'Carbon Neutral Shipments',
    subtitle: 'Beautiful nails, beautiful planet.',
    content: `
### Our Environmental Promise
We offset 100% of the carbon emissions associated with shipping our products. By partnering with verified environmental organizations, we invest in reforestation and renewable energy projects worldwide.

Our packaging is made from 80% post-consumer recycled materials, and our press-on trays are fully recyclable.
    `
  },
  'press': {
    title: 'Press & Media Enquiries',
    subtitle: "Join the Zivora conversation.",
    content: `
### Media Relations
For press features, editorial requests, or influencer collaborations, please contact our PR team.

**Email**: pr@zivora.in

Download our latest Brand Kit and High-Resolution Image Library [here](#).
    `
  },
  'wholesale': {
    title: 'Wholesale & Salon Partners',
    subtitle: "Bring Zivora to your studio.",
    content: `
### Partner with Us
Are you a salon owner, nail technician, or boutique retailer looking to stock premium nail products?

We offer competitive wholesale pricing and exclusive professional-only product lines. To apply for a professional account, please email **wholesale@zivora.in** with your business details and license number.
    `
  },

  // Legal
  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'How we protect and manage your data.',
    content: `
### 1. Information We Collect
We collect information you provide directly to us, such as when you create an account, place an order, or contact customer support. This may include your name, email address, shipping address, and payment information.

### 2. How We Use Your Information
We use your information to fulfill orders, process payments, and communicate with you about your order status and promotional offers.

### 3. Data Security
We implement robust security measures, including SSL encryption, to protect your personal information. We do not sell your data to third parties.
    `
  },
  'terms-of-service': {
    title: 'Terms of Service',
    subtitle: 'The rules of engagement.',
    content: `
### 1. Acceptance of Terms
By accessing or using the Zivora website, you agree to be bound by these Terms of Service.

### 2. Intellectual Property
All content on this site, including images, text, and logos, is the exclusive property of Zivora and is protected by copyright laws.

### 3. Limitation of Liability
Zivora shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.
    `
  }
};
