# Soltech Savings Calc

Build a standalone public-facing web application called:

"Soltech Energy – Solar Savings Calculator"

IMPORTANT:

This is NOT a page that should be embedded into the existing Soltech website.

It must be a separate, shareable public URL that can later be linked from Instagram, Facebook, WhatsApp and the Soltech portfolio.

The purpose is to generate qualified solar leads while giving homeowners an estimated solar system size and savings estimate.

DESIGN:

Use Soltech Energy's existing visual identity:

- Premium blue + green + yellow theme

- Clean white backgrounds

- Modern typography

- Professional solar-energy aesthetic

- Subtle yellow accents for solar/sun elements

- Green for positive savings/results

- Blue for primary UI elements

- Rounded cards and buttons

- Mobile-first responsive design

The experience should feel similar to a modern fintech/solar calculator rather than a boring Google Form.

VERY IMPORTANT:

Do NOT show a long form on one page.

Show ONE QUESTION AT A TIME with:

- Question

- Short helper text

- Large selectable answer cards

- Back button

- Continue button where necessary

- Progress indicator such as 1/7, 2/7 etc.

- Smooth transitions between questions

The entire assessment should feel like it takes less than 60 seconds.

FLOW:

SCREEN 1:

Heading:

"Let's calculate your solar savings"

Subheading:

"See your estimated solar savings in less than 60 seconds."

Button:

"Start Calculation"

SCREEN 2:

Question:

"When are you planning to get solar?"

Options:

1. Immediately

2. Within 3 months

3. Within 6 months

4. Just exploring

SCREEN 3:

Question:

"What type of roof do you have?"

Options:

1. Concrete Roof

Helper: "Full eligibility"

2. Metal Sheet Roof

Helper: "Owner approval"

3. Brick Roof

Helper: "Owner approval"

SCREEN 4:

Question:

"How big is your terrace?"

Options:

1. Small

"<200 sq. ft."

2. Medium

"200–400 sq. ft."

3. Large

"400+ sq. ft."

SCREEN 5:

Question:

"How often do power cuts disturb you?"

Options:

1. No power cuts

2. Less than 1 hour

3. 1–4 hours

4. More than 4 hours

SCREEN 6:

Question:

"What's your average monthly electricity bill?"

Options:

1. Below ₹2,000

2. ₹2,000–₹4,000

3. ₹4,000–₹6,000

4. ₹6,000–₹10,000

5. Above ₹10,000

This information must be used in the savings calculation.

SCREEN 7:

Question:

"Where is your home located?"

Fields:

- City / Location — REQUIRED

- PIN Code — OPTIONAL

- Landmark — OPTIONAL

Do NOT make PIN code mandatory.

SCREEN 8:

Question:

"Where should we send your savings estimate?"

Fields:

- Full Name — REQUIRED

- WhatsApp Number — REQUIRED

- Email — OPTIONAL

Validate the WhatsApp number properly.

RESULT SCREEN:

Display:

"Here's your estimated solar savings"

"Based on the details you provided"

Show prominent result cards for:

1. Recommended Solar System Size

Example: "4 kW"

2. Estimated Monthly Savings

Example: "₹4,600"

3. Estimated Annual Savings

Example: "₹55,200"

4. Estimated 5-Year Savings

Example: "₹2,76,000"

Also display:

- Location

- Estimated system size

- Key assumptions used

IMPORTANT:

Do not present savings as guaranteed.

Use wording such as:

"Estimated"

"Indicative"

"Actual savings may vary based on electricity consumption, roof orientation, shading, tariff, system design and site conditions."

CALCULATION LOGIC:

Create a transparent estimation engine based on:

- Monthly electricity bill range

- Roof size

- Location

- Roof type

Estimate an appropriate solar system size in kW.

Do not generate random numbers.

Use clearly defined calculation constants that can be edited later from one configuration file/database table.

The calculation should produce:

- Recommended kW

- Estimated monthly generation

- Estimated monthly savings

- Estimated annual savings

- Estimated 5-year savings

Keep the calculations conservative and clearly label them as estimates.

Do NOT include subsidy assumptions unless they are explicitly configurable.

LEAD CAPTURE:

Every completed assessment must create a lead record containing:

- Name

- WhatsApp number

- Email if provided

- Location

- PIN code if provided

- Landmark if provided

- Timeline

- Roof type

- Terrace size

- Power-cut frequency

- Electricity bill range

- Recommended kW

- Estimated monthly savings

- Estimated annual savings

- Estimated 5-year savings

- Date/time of submission

- Source/campaign if available

Create a simple lead database/table so Soltech can access submitted leads.

WHATSAPP AUTOMATION:

After successful submission, automatically send the customer a WhatsApp message containing their personalized result.

The message should follow this structure:

"Hi [Name]! 👋

Thank you for using Soltech Energy's Solar Savings Calculator.

Based on the details you provided:

☀️ Recommended System: [X] kW

💰 Estimated Monthly Savings: ₹[X]

📈 Estimated Annual Savings: ₹[X]

🏠 Location: [Location]

These figures are indicative and may vary based on your actual electricity consumption, roof conditions, shadow analysis, electricity tariff and final system design.

If you'd like a more accurate assessment or quotation, our Soltech Energy team would be happy to help.

Reply 'QUOTE' or contact us for assistance.

— Soltech Energy, Jaipur

Powering homes. Saving more."

IMPORTANT WHATSAPP REQUIREMENT:

Do not fake the WhatsApp integration.

Build the application so that it can connect to a real WhatsApp Business API provider such as Meta WhatsApp Cloud API or Twilio.

Create secure environment-variable placeholders for:

- WhatsApp API credentials

- Phone Number ID

- Access Token

- Template/message configuration

Do not expose API credentials in frontend code.

If an approved WhatsApp template is required, structure the integration so the template can be connected later.

Also provide a fallback "Send result on WhatsApp" button that opens WhatsApp with a pre-filled message if the API integration has not yet been configured.

LEAD NOTIFICATION:

After a lead is submitted, also create an internal notification for Soltech containing the customer's:

- Name

- Phone

- Location

- Recommended system size

- Estimated savings

- All submitted form answers

The lead must be stored even if WhatsApp delivery fails.

UX:

- Fast loading

- Mobile-first

- No unnecessary fields

- No unnecessary animations

- Clear error messages

- Back navigation must preserve entered answers

- Prevent duplicate submissions

- Show a success state after submission

CTA AFTER RESULT:

Primary:

"Get a Free Quote"

Secondary:

"Talk to Soltech on WhatsApp"

Also include:

"Start Again"

Create the final application as production-ready and provide the public route/URL after deployment.
https://se-portfolio-final-2my8hvnhw-aparaj.vercel.app/ take data from this portfolio and the logo as well 
shared with you the inspos how i want it

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bf872b75-2d91-480e-8b4d-7813b41e80cc).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
