"use client";

import { useState } from "react";

type AnalysisResult = {
  status: string;
  brandName?: string;
  productType?: string;
  alcoholContent?: string;
  governmentWarning?: string;
  healthOrMisleadingClaims?: string;
  missingItems?: string[];
  recommendation?: string;
};

export default function Home() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  }

  async function analyzeLabel() {
    if (!imagePreview) {
      setResult({
        status: "WARNING",
        recommendation: "Please upload a label image before running analysis.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/analyze-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imagePreview }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      const cleaned = data.result
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      setResult(parsed);
    } catch {
      setResult({
        status: "FAIL",
        recommendation:
          Human compliance review recommended because some label details could not be confidently verified.
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-emerald-400">
            AI Compliance Prototype
          </p>
          <h1 className="text-4xl font-bold md:text-6xl">
            Alcohol Label Verification
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Upload an alcohol label image and generate a structured compliance
            review for required labeling elements, warnings, and risk indicators.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h2 className="text-2xl font-semibold">Upload Label</h2>
            <p className="mt-2 text-sm text-slate-400">
              Supported files: JPG, PNG, or WEBP.
            </p>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 p-10 text-center hover:border-emerald-400">
              <span className="text-lg font-medium">
                Click to upload a label image
              </span>
              <span className="mt-2 text-sm text-slate-500">
                We will preview it before analysis.
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-slate-300">
                  Image Preview
                </p>
                <img
                  src={imagePreview}
                  alt="Uploaded label preview"
                  className="max-h-80 w-full rounded-xl object-contain"
                />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
            <h2 className="text-2xl font-semibold">Compliance Summary</h2>
            <p className="mt-2 text-sm text-slate-400">
              AI-generated prototype results will appear here.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-400">Status</p>
                <p
  className={`mt-1 text-xl font-semibold ${
    result?.status === "PASS"
      ? "text-emerald-400"
      : result?.status === "FAIL"
      ? "text-red-400"
      : "text-yellow-400"
  }`}
>
  {result?.status || "Awaiting Label Upload"}
</p>

                </div>

              {result ? (
                <div className="space-y-3 rounded-xl bg-slate-950 p-4 text-slate-300">
                  <p>
                    <strong>Brand Name:</strong>{" "}
                    {result.brandName || "Needs human review"}
                  </p>
                  <p>
                    <strong>Product Type:</strong>{" "}
                    {result.productType || "Needs human review"}
                  </p>
                  <p>
                    <strong>Alcohol Content:</strong>{" "}
                    {result.alcoholContent || "Needs human review"}
                  </p>
                  <p>
                    <strong>Government Warning:</strong>{" "}
                    {result.governmentWarning || "Needs human review"}
                  </p>
                  <p>
                    <strong>Health/Misleading Claims:</strong>{" "}
                    {result.healthOrMisleadingClaims || "Needs human review"}
                  </p>

                  <div>
                    <strong>Missing Items:</strong>
                    <ul className="mt-2 list-disc pl-5">
                      {result.missingItems?.length ? (
                        result.missingItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))
                      ) : (
                        <li>None detected</li>
                      )}
                    </ul>
                  </div>

                  <p>
                    <strong>Recommendation:</strong>{" "}
                    {result.recommendation || "Needs human review"}
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-950 p-4 text-slate-300">
                  Upload a label image, then click Analyze Label.
                </div>
              )}

              <button
                onClick={analyzeLabel}
                disabled={loading}
                className="w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Analyzing..." : "Analyze Label"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}