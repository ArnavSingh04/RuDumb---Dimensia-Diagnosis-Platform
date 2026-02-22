/**
 * Simple rule-based risk tier calculation.
 * Abnormal vitals or low mock cognitive scores increase risk.
 */

const VITAL_RANGES = {
  heartRate: { min: 60, max: 100 },
  systolicBP: { min: 90, max: 140 },
  diastolicBP: { min: 60, max: 90 },
  respiratoryRate: { min: 12, max: 20 },
  oxygenSaturation: { min: 95, max: 100 },
};

function isVitalAbnormal(key, value) {
  if (value == null || value === "") return false;
  const num = Number(value);
  if (Number.isNaN(num)) return false;
  const range = VITAL_RANGES[key];
  if (!range) return false;
  return num < range.min || num > range.max;
}

function countAbnormalVitals(vitals) {
  if (!vitals) return 0;
  let count = 0;
  for (const [key, value] of Object.entries(vitals)) {
    if (isVitalAbnormal(key, value)) count++;
  }
  return count;
}

function cognitiveScoreRisk(cognitiveScores) {
  if (!cognitiveScores || typeof cognitiveScores !== "object") return 0;
  let risk = 0;
  const scores = Object.values(cognitiveScores).filter(
    (v) => typeof v === "number" && !Number.isNaN(v)
  );
  for (const s of scores) {
    if (s < 50) risk += 2;
    else if (s < 70) risk += 1;
  }
  return risk;
}

/**
 * @param {Object} assessment - assessment doc with vitals and cognitiveScores
 * @returns {'low'|'moderate'|'high'}
 */
export function calculateRiskTier(assessment) {
  const vitalAbnormals = countAbnormalVitals(assessment?.vitals);
  const cognitiveRisk = cognitiveScoreRisk(assessment?.cognitiveScores);

  const total = vitalAbnormals * 2 + cognitiveRisk;

  if (total >= 4) return "high";
  if (total >= 2) return "moderate";
  return "low";
}
