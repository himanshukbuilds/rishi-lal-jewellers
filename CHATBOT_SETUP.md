# Rishi Lal Jewellers — Halku (AI Jewellery Shopping Assistant)

This document outlines the architecture, setup instructions, configuration details, and testing steps for **Halku**, the dedicated AI jewellery shopping assistant and stylist for Rishi Lal Jewellers.

---

## 1. Overview & Architecture

**Halku** is the customer-facing AI shopping assistant and digital jewellery concierge integrated into the Rishi Lal Jewellers e-commerce website. Halku is designed to act as an in-store personal jeweler and bridal stylist, speaking with warm Indian hospitality, deep gemological knowledge, and refined elegance.

### Key Capabilities
- **Customer-Facing Identity**: Named **Halku**, with subtitle *"Your Jewellery Assistant"* and welcoming greeting: *"Hi! I'm Halku, your jewellery shopping assistant at Rishi Lal Jewellers. How can I help you today?"*.
- **Original Local Avatar**: Features an original, high-resolution luxury portrait of Halku stored locally at `frontend/public/images/avatar/halku.png` with deep forest green (`#09371F`) and champagne gold (`#C2AA6A`) attire. The customer-facing UI contains zero external Gemini, Apple, or third-party branding.
- **Real-Time Product Recommendations**: Connects to the live MongoDB product database through the Express backend to recommend actual in-stock creations with real prices, high-definition images, BIS hallmarking details, and direct links.
- **Natural Language Shopping Queries**: Understands budget constraints (e.g., *"Suggest bridal jewelry under ₹50,000"* or *"Show me diamond rings under 1 lakh"*), metal preferences (*22K yellow gold*, *18K rose gold*, *white gold*), and occasions (*bridal/wedding*, *daily wear*, *anniversary gifting*).
- **In-Chat Product Cards**: Displays recommended creations within the conversation with price formatting in Indian Rupees (₹), purity tags, "View Details" links, and direct "Add to Bag" cart actions.
- **Store Policy Intelligence**: Answers frequent questions about 100% BIS Hallmarking (6-digit HUID), IGI/GIA diamond certifications, the 15-day return and exchange policy, complimentary insured shipping, and showroom hours.
- **Graceful Dual-Engine Resilience**: Powered by Google Gemini through the official `@google/genai` SDK on the backend. If an API key is missing, invalid, or reaches quota limits, the system seamlessly transitions to a verified local Halku Knowledge Engine without breaking or leaking errors to customers.

---

## 2. Files Added & Modified

### Backend Additions & Updates
- [`backend/src/services/geminiService.js`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/backend/src/services/geminiService.js): Google Gemini integration using `@google/genai`, updated system instructions with Halku assistant identity, multi-turn history handling, and safe error handling.
- [`backend/src/services/productSearchService.js`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/backend/src/services/productSearchService.js): MongoDB search service with natural language criteria extraction (budget, category, metal, occasion) and live catalog summaries.
- [`backend/src/controllers/chatController.js`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/backend/src/controllers/chatController.js): Chat endpoint controller with input validation, MongoDB querying, Gemini execution, and verified Halku fallback.
- [`backend/src/routes/chatRoutes.js`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/backend/src/routes/chatRoutes.js): Express router with IP-based rate limiting (60 requests per 15 mins) for `POST /api/chat`.
- [`backend/src/config/constants.js`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/backend/src/config/constants.js): `GEMINI_API_KEY` and `GEMINI_MODEL` configurations.
- [`backend/test/chat.test.js`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/backend/test/chat.test.js): Automated test suite for search extraction, multi-turn context, input validation, and Halku identity verification.

### Frontend Additions & Updates
- [`frontend/public/images/avatar/halku.png`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/frontend/public/images/avatar/halku.png): Original, high-resolution portrait avatar of Halku with deep green and champagne gold accents.
- [`frontend/src/components/chat/JewelryChatbot.jsx`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/frontend/src/components/chat/JewelryChatbot.jsx): Floating launcher widget with Halku avatar, "Ask Halku" invitation pill, and responsive modal.
- [`frontend/src/components/chat/ChatWindow.jsx`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/frontend/src/components/chat/ChatWindow.jsx): Chat window with Halku header, subtitle "Your Jewellery Assistant", welcome message, typing indicator ("Halku is curating..."), quick actions, and reset button.
- [`frontend/src/components/chat/ChatMessage.jsx`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/frontend/src/components/chat/ChatMessage.jsx): Message bubbles with Halku avatar and label, formatted text, and embedded product cards.
- [`frontend/src/components/chat/ChatProductCard.jsx`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/frontend/src/components/chat/ChatProductCard.jsx): Mini product card with real product photo, price in ₹, "View Details" navigation, and "Add to Bag" cart integration.
- [`frontend/src/components/chat/ChatQuickActions.jsx`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/frontend/src/components/chat/ChatQuickActions.jsx): Quick prompt pills (Bridal Collection, Under ₹50K, Silver Idols, Gold Coins, Help & Support).
- [`frontend/src/components/chat/ChatInput.jsx`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/frontend/src/components/chat/ChatInput.jsx): Auto-resizing textarea with Enter-to-send and Shift+Enter for multiline input.
- [`frontend/src/services/api.js`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/frontend/src/services/api.js): `sendChatMessage(message, history)` with automatic offline fallback.
- [`frontend/src/app/(store)/layout.jsx`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/frontend/src/app/(store)/layout.jsx): Mounted `<JewelryChatbot />` across all customer-facing store pages.

---

## 3. How to Obtain and Configure a Google Gemini API Key

1. **Obtain an API Key**:
   - Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
   - Sign in with your Google account.
   - Click **Create API Key** and copy the key (standard keys typically begin with `AIzaSy...`).

2. **Configure Backend Environment Variables**:
   Open or create [`backend/.env`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/backend/.env):

   ```bash
   PORT=5001
   MONGODB_URI=mongodb://127.0.0.1:27017/rishi_lal_jewellers
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   NODE_ENV=development

   # Google Gemini AI Integration
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

> [!SECURITY]
> **Security Rule**: The `GEMINI_API_KEY` is read **strictly on the Express backend**. It is never included in the Next.js frontend, never exposed in client bundles or network responses, and excluded from version control via `.gitignore`.

---

## 4. Starting the Application

### Backend:
```bash
cd backend
npm install
npm run start   # or npm run dev for auto-reload
```
The REST API runs on `http://localhost:5001`.

### Frontend:
```bash
cd frontend
npm install
npm run dev     # for local development on http://localhost:3000
# or
npm run build && npm start  # for production
```

---

## 5. Verification & Testing

### Running Automated Backend Tests
```bash
cd backend
npm test
```
Runs Node's built-in test runner against search extraction, category prioritization, multi-turn memory, and controller validation.

### Testing Sample Customer Queries
You can test the chatbot directly via the UI or using cURL:

1. **Bridal jewelry within budget**:
   ```bash
   curl -X POST http://localhost:5001/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Suggest bridal jewelry under ₹50,000."}'
   ```
   *Expected outcome*: Identifies that bridal sets in the showroom start at higher price tiers, politely informs the customer, and presents affordable alternatives (e.g. lightweight 18K chains and studs from ₹42,000).

2. **Gold necklaces for daily wear**:
   ```bash
   curl -X POST http://localhost:5001/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Show me gold necklaces for daily wear."}'
   ```
   *Expected outcome*: Returns matching 22KT and 18KT gold neckwear with real product cards, prices, and links.

3. **Store policies & certifications**:
   ```bash
   curl -X POST http://localhost:5001/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "What is your return policy and hallmark certification?"}'
   ```
   *Expected outcome*: Confirms 100% BIS hallmarking with 6-digit HUID, IGI/GIA diamond certifications, 15-day return policy, and free insured delivery.

---

## 6. Troubleshooting Common Issues

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **"API key not valid" (401)** | The key passed to `GEMINI_API_KEY` is invalid, expired, or an OAuth access token rather than an AI Studio API key. | Ensure you generate a valid API key from [Google AI Studio](https://aistudio.google.com/app/apikey). The system automatically falls back to the built-in Concierge Engine without failing. |
| **Model Not Found (404)** | The model configured in `GEMINI_MODEL` is deprecated or unavailable in your region. | Set `GEMINI_MODEL=gemini-2.5-flash` or `gemini-3.8-flash` in `backend/.env`. |
| **No Products Returned** | Search criteria were too restrictive (e.g., specific combination of price and category not in stock). | The assistant suggests relaxing the filter and provides quick-action buttons for related categories. |
| **429 Rate Limit Exceeded** | More than 60 requests sent within 15 minutes from the same IP. | Wait for the rate-limit window to reset, or adjust `max` in [`chatRoutes.js`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/backend/src/routes/chatRoutes.js). |

---

## 7. Production Deployment Checklist
1. Ensure `GEMINI_API_KEY` is added to your production server environment (e.g., Render, Railway, AWS ECS).
2. Set `NODE_ENV=production` and specify your production frontend domain in `CLIENT_URL`.
3. Verify that MongoDB is connected via standard `MONGODB_URI`.
4. Ensure `.env` is never committed to GitHub or public repositories.

