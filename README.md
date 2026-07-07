# AI-Powered Alcohol Label Verification Prototype

## Overview

This project is a prototype web application built for the U.S. Department of the Treasury take-home assessment.

The application allows users to upload an alcohol beverage label image and uses the OpenAI API to analyze the label for required compliance elements.

The prototype identifies:

- Brand Name
- Product Type
- Alcohol Content (ABV)
- Government Warning
- Health or Misleading Claims
- Missing Required Elements
- Compliance Recommendation

---

## Features

- Upload JPG, PNG, or WEBP label images
- AI-powered label analysis
- Structured compliance review
- PASS / WARNING / FAIL status
- Responsive web interface

---

## Technologies Used

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- OpenAI API
- Vercel

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Install dependencies

```bash
npm install
```

Create a `.env.local` file

```env
OPENAI_API_KEY=your_openai_api_key
```

Run the application

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:3000
```

---

## Assumptions

- Images are reasonably clear and readable.
- The AI may request human review when text is unclear.
- The prototype is intended to assist reviewers, not replace human compliance decisions.

---

## Limitations

- OCR accuracy depends on image quality.
- The prototype checks a limited set of common alcohol labeling requirements.
- Results should always be reviewed by a human compliance specialist.

---

## Future Improvements

- OCR preprocessing for better text extraction
- Support for multiple label uploads
- Export compliance reports as PDF
- Confidence scores for detected fields
- Additional validation rules based on TTB guidance

---

## Author

Eghosa Ihazah