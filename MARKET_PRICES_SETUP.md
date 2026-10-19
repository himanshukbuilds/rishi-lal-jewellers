# Live Precious Metal & Diamond Pricing — Rishi Lal Jewellers

This document details the architecture, provider integrations, configuration, security practices, and verification steps for the **Live Gold, Silver & Diamond Market Prices** feature on the Rishi Lal Jewellers e-commerce platform.

---

## 1. Selected Market Data Providers

To ensure full compliance with the requirement for **genuine, legitimate market rates** (with zero fabricated, random, or artificial ticker numbers), the backend is built to interface with authenticated bullion and gemological benchmarks:

### Provider 1: IBJA (India Bullion and Jewellers Association Ltd.) — Primary Official Benchmark
* **Official Website**: [indiagoldratesapi.com](https://indiagoldratesapi.com/) / [ibjarates.com](https://ibjarates.com/)
* **Official Documentation**: [IBJA Rates API Documentation](https://indiagoldratesapi.com/Documentation.aspx)
* **Why Selected**: IBJA is the apex trade body established in 1919 and recognized by the Reserve Bank of India (RBI) and the Ministry of Finance for Sovereign Gold Bond (SGB) valuations and national domestic benchmark rates.
* **Update Frequency**: Published twice daily on trading days:
  * Morning Opening Session: **12:30 IST**
  * Evening Closing Session: **18:30 IST**
* **Supported Purities**: 24K (Gold 999), 22K (Gold 916), 18K (Gold 750), 14K (Gold 585), and Fine Silver 999.
* **Access Requirement**: An official enterprise subscription key (`ACCESS_TOKEN`) obtained via IBJA registration.

### Provider 2: GoldAPI.io — Real-Time Bullion Spot Feeds (Secondary Option)
* **Official Website**: [goldapi.io](https://www.goldapi.io/)
* **Official Documentation**: [GoldAPI.io Docs](https://www.goldapi.io/)
* **Why Selected**: Provides continuous spot bullion exchange rates for `XAU/INR` (Gold in Indian Rupees) and `XAG/INR` (Silver in Indian Rupees) directly calculated per gram, 10 grams, and kilogram with official millisecond timestamps.
* **Update Frequency**: Real-time continuous market quotes.

### Provider 3: Rapaport Diamond Price Index (RapNet B2B) — Diamond Benchmark
* **Official Website**: [rapaport.com](https://rapaport.com/)
* **Official Documentation**: [Rapaport Price Index & API](https://rapaport.com/diamond-price-index/)
* **Access Requirement**: Requires an active, paid B2B RapNet trade subscription.
* **Important Industry Truth**: Unlike standardized gold bullion bars (which have a uniform spot price per gram based purely on fineness), natural diamonds **cannot be quoted by a generic gram rate**. Diamond valuations depend strictly on the **4Cs** (Carat weight, Color, Clarity, Cut), laboratory grading (GIA or IGI), fluorescence, and polish. As mandated, until an active Rapaport trade subscription key (`RAPAPORT_CLIENT_ID`) is connected, the diamond panel explicitly states:
  > *"Diamond pricing data is currently unavailable. Diamond market rates require an active Rapaport trade subscription. Unlike gold bullion, diamond values depend strictly on individual laboratory 4Cs certification."*

---

## 2. Backend Environment Configuration

All credentials reside strictly on the Express backend and are never exposed to browser bundles or public API responses.

Configure in [`backend/.env`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/backend/.env):

```bash
# Option 1: Official IBJA Rates API
IBJA_ACCESS_TOKEN=your_ibja_access_token_here
IBJA_ENV=production   # 'production' or 'uat'

# Option 2: GoldAPI.io Bullion Spot Feeds
GOLDAPI_KEY=your_goldapi_key_here

# Diamond Valuation Feed (RapNet B2B)
RAPAPORT_CLIENT_ID=your_rapaport_client_id_here
RAPAPORT_CLIENT_SECRET=your_rapaport_client_secret_here
```

> [!NOTE]
> If neither `IBJA_ACCESS_TOKEN` nor `GOLDAPI_KEY` is provided, the API returns a structured `dataStatus: "UNCONFIGURED"` response explaining that credentials must be configured in `backend/.env`. The application does not crash, nor does it invent fake prices.

---

## 3. Server-Side Caching & Rate Limiting

To comply with provider usage caps and avoid redundant external network requests for every visitor, the backend implements:
- **15-Minute Caching (`CACHE_TTL_MS = 15 * 60 * 1000`)**: Successful rate responses are cached in memory on the Express server.
- **Cache Age Tracking**: Each response includes `retrievedAt`, `sourceTimestamp`, and `dataStatus: "CURRENT"`.
- **Stale Fallback**: If an external provider experiences downtime or a network timeout, the server serves the last verified rates with `dataStatus: "STALE"` and an explanatory warning.
- **Client Rate Limiting**: The `/api/market-prices` route is protected by `express-rate-limit` (120 requests / 15 minutes per IP).

---

## 4. API Response Schema

### `GET /api/market-prices`
Sample JSON output when a provider is connected:

```json
{
  "success": true,
  "dataStatus": "CURRENT",
  "isCached": false,
  "retrievedAt": "2026-10-19T18:30:00.000Z",
  "sourceTimestamp": "2026-10-19T12:30:00.000Z",
  "provider": "IBJA (Indian Bullion and Jewellers Association Ltd.)",
  "providerType": "Official Indian Benchmark",
  "session": "Evening Closing (18:30 IST)",
  "gold": {
    "available": true,
    "currency": "INR",
    "symbol": "₹",
    "benchmark": "Official IBJA Benchmark (Excl. 3% GST & Making Charges)",
    "disclaimer": "Official IBJA trade benchmark rate published twice daily on working bullion trading days.",
    "rates": {
      "24k": {
        "purity": "24 Karat (999 Purity)",
        "fineness": "999/1000 Fine Gold",
        "perGram": 7890,
        "per10Gram": 78900
      },
      "22k": {
        "purity": "22 Karat (916 Purity)",
        "fineness": "916/1000 Hallmarked Jewelry Gold",
        "perGram": 7232,
        "per10Gram": 72320
      },
      "18k": {
        "purity": "18 Karat (750 Purity)",
        "fineness": "750/1000 Fine Diamond Jewelry Gold",
        "perGram": 5918,
        "per10Gram": 59180
      }
    }
  },
  "silver": {
    "available": true,
    "currency": "INR",
    "symbol": "₹",
    "purity": "999 Fine Silver",
    "perGram": 98.50,
    "perKg": 98500,
    "benchmark": "Official IBJA Silver Benchmark"
  },
  "diamonds": {
    "available": false,
    "status": "UNAVAILABLE",
    "provider": "RapNet / Rapaport Diamond Price Index (RapNet B2B)",
    "selectedSpecs": {
      "carat": 1.0,
      "shape": "Round Brilliant",
      "color": "D-F (Colorless)",
      "clarity": "VVS1-VVS2",
      "origin": "Natural Earth-Mined"
    },
    "message": "Diamond pricing data is currently unavailable. Natural diamond trade valuation requires active Rapaport B2B credentials (RAPAPORT_CLIENT_ID and RAPAPORT_CLIENT_SECRET in backend/.env).",
    "distinction": {
      "natural": "100% Earth-Mined Solitaire Diamonds: Rare, natural crystalline carbon formed over billions of years deep within the earth mantle, certified by IGI or GIA.",
      "labGrown": "Lab-Grown Diamonds (CVD/HPHT): Factory-synthesized stones created in chambers with substantially lower secondary market valuation."
    },
    "valuationBasis": "Unlike gold and silver commodities which trade at uniform gram rates, diamond valuation is determined individually by the 4Cs: Carat weight, Cut & Shape, Colour grade, and Clarity grade, verified by independent laboratory certificates (GIA or IGI).",
    "disclaimer": "Unlike gold bullion, diamond prices vary dynamically by carat weight, shape (Round, Princess, Oval), colour (D to Z), clarity (IF to I3), cut grade, fluorescence, and accredited laboratory certification (GIA or IGI). There is no single generic diamond gram rate."
  }
}
```

---

## 5. Frontend UI/UX Behavior

- **Placement**: Mounted directly below the 4 jewelry category cards on the homepage in [`page.jsx`](file:///Users/himanshukumar/Desktop/Jewelry-Shop/frontend/src/app/(store)/page.jsx).
- **Initial Collapsed State**: Compact, framed deep-green banner with champagne-gold trim:
  - Heading: *"Today's Precious Metal Prices"*
  - Subtitle: *"Check the latest available gold, silver and diamond market benchmark rates."*
  - Badge: *"Market rates • India"*
  - CTA Button: **"CHECK TODAY'S PRICES"**
- **Expanded State**:
  - Toggles smoothly in place without leaving the homepage.
  - Three cards:
    1. **Gold Rates**: 24K Pure Gold (999), 22K Jewelry Gold (916), and 18K Diamond Jewelry Gold (750) per gram and per 10 grams in ₹.
    2. **Silver Rates**: Pure 999 Silver per gram and per kilogram in ₹, with link to Divine Silver Idols collection.
    3. **Diamond Benchmarks**: Interactive 4Cs Matrix explorer with live dropdown selectors for Carat (0.50ct to 2.00ct), Shape (Round Brilliant, Princess, Emerald, Oval), Color (D-F, G-H, I-J), Clarity (VVS, VS, SI), and Diamond Origin (Natural Earth-Mined vs Lab-Grown). Shows a dynamic specification summary and clear explanation of laboratory certification.
  - Includes **"Refresh Prices"** and **"HIDE PRICES"** controls.
  - Shows clear provider attribution, last retrieval time, and transparent retail disclaimers (noting that finished jewellery additionally includes crafting charges and 3% GST).

---

## 6. How to Test

### Automated Tests
Run the backend test suite:
```bash
cd backend
npm test
```
Verifies:
1. `getDiamondStatus()` returns authentic status and disclaimer without fake numbers.
2. `getMarketPrices()` returns structured payload adhering to schema.
3. Controller responds with HTTP 200 and safe unconfigured status when credentials are not yet supplied.

### Manual Verification
1. Visit `http://localhost:3000`.
2. Locate the **"Today's Precious Metal Prices"** banner immediately below the four category cards.
3. Click **"CHECK TODAY'S PRICES"**.
4. Observe the smooth expansion showing gold, silver, and diamond sections with transparent provider status.
5. Click **"Refresh Prices"** to observe rate polling.
6. Click **"HIDE PRICES"** to collapse the panel back to its clean default state.

