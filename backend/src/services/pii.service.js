// services/pii.service.js
// Returns qualitative label; all computed values are unitless; time inputs in milliseconds (ms).

exports.computePublicInterestIndex = (event) => {
  // Step 1: Sale window interest (unitless in [0,1])
  let salesWindowInterest = 0.5;
  try {
    const t_now = Date.now();
    const t_start = new Date(event?._raw_tm?.sales?.public?.startDateTime || event?.sales?.public?.startDateTime).getTime();
    const t_end = new Date(event?._raw_tm?.sales?.public?.endDateTime || event?.sales?.public?.endDateTime).getTime();
    if (Number.isFinite(t_start) && Number.isFinite(t_end) && t_end > t_start) {
      const frac = 1 - (t_now - t_start) / (t_end - t_start);
      salesWindowInterest = Math.max(0, Math.min(1, frac));
    }
  } catch { salesWindowInterest = 0.5; }

  // Step 2: Status-based baseline
  let interestScore = 0.5;
  try {
    const status = event?._raw_tm?.dates?.status?.code || event?.dates?.status?.code;
    if (status === "onsale") interestScore = 0.7;
    else if (status === "offsale") interestScore = 0.1;
    else if (status === "cancelled") interestScore = 0.0;
    else if (status === "postponed") interestScore = 0.3;
    else if (status === "rescheduled") interestScore = 0.4;
  } catch { interestScore = 0.5; }

  // Step 3: Availability text hints
  let avail = 0.5;
  try {
    const text = ((event?._raw_tm?.pleaseNote || event?.pleaseNote || "") + " " + (event?._raw_tm?.info || event?.info || "")).toLowerCase();
    if (text.includes("sold out")) avail = 1.0;
    else if (text.includes("limited")) avail = 0.8;
    else if (text.includes("standing only")) avail = 0.7;
  } catch { avail = 0.5; }

  // Presales smoothing [0,1]
  const presales = event?._raw_tm?.sales?.presales || event?.sales?.presales;
  const n = Array.isArray(presales) ? presales.length : 0;
  const presalesInterest = n / (n + 3);

  // Weighted unitless score
  let idx = 0.25 * salesWindowInterest + 0.35 * interestScore + 0.25 * avail + 0.15 * presalesInterest;
  idx = Math.round(idx * 100) / 100;

  if (idx >= 0.9) return "Very High Interest";
  if (idx >= 0.6) return "High Interest";
  if (idx >= 0.3) return "Moderate Interest";
  return "Low Interest";
};
