import Booking from "../models/Booking.js";

const THRESHOLD_HOURS = 48;

const STOP_WORDS = new Set([
  "near",
  "road",
  "main",
  "street",
  "cross",
  "block",
  "phase",
  "layout",
  "house",
  "flat",
  "floor",
  "apartment",
  "building",
  "bangalore",
  "bengaluru",
  "india",
]);

const KNOWN_AREAS = [
  "indiranagar",
  "koramangala",
  "whitefield",
  "marathahalli",
  "hsr",
  "btm",
  "jayanagar",
  "jp nagar",
  "electronic city",
  "hebbal",
  "yelahanka",
  "domlur",
  "bellandur",
  "sarjapur",
  "kengeri",
  "malleshwaram",
  "rajajinagar",
];

const normalize = (text = "") =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getPincode = (address) => {
  const match = address.match(/\b\d{6}\b/);
  return match ? match[0] : null;
};

const getArea = (address) => {
  const normalized = normalize(address);

  return KNOWN_AREAS.find((area) => normalized.includes(area)) || null;
};

const getKeywords = (address) => {
  return normalize(address)
    .split(" ")
    .filter((word) => word.length > 2)
    .filter((word) => !STOP_WORDS.has(word))
    .filter((word) => !/^\d+$/.test(word));
};

const calculateAddressScore = (inputAddress, bookedAddress) => {
  const inputNormalized = normalize(inputAddress);
  const bookedNormalized = normalize(bookedAddress);

  const inputPincode = getPincode(inputNormalized);
  const bookedPincode = getPincode(bookedNormalized);

  const inputArea = getArea(inputNormalized);
  const bookedArea = getArea(bookedNormalized);

  const inputWords = getKeywords(inputNormalized);
  const bookedWords = getKeywords(bookedNormalized);

  let score = 0;

  if (inputPincode && bookedPincode && inputPincode === bookedPincode) {
    score += 45;
  }

  if (inputArea && bookedArea && inputArea === bookedArea) {
    score += 35;
  }

  const commonWords = inputWords.filter((word) => bookedWords.includes(word));

  const keywordScore =
    inputWords.length === 0
      ? 0
      : Math.round((commonWords.length / inputWords.length) * 20);

  score += keywordScore;

  return Math.min(score, 100);
};

const getSlotDateTime = (slot) => {
  return new Date(`${slot.date}T${slot.startTime}:00`);
};

const getReward = (score) => {
  if (score >= 80) {
    return {
      discount: 10,
      ecoPoints: 50,
      tag: "Best Eco Match",
    };
  }

  if (score >= 60) {
    return {
      discount: 7,
      ecoPoints: 35,
      tag: "Nearby Delivery Match",
    };
  }

  return {
    discount: 5,
    ecoPoints: 20,
    tag: "Optimized Delivery Slot",
  };
};

export const getSmartSlotRecommendation = async (address) => {
  if (!address || address.trim().length < 8) {
    return null;
  }

  const now = new Date();
  const maxTime = new Date(now.getTime() + THRESHOLD_HOURS * 60 * 60 * 1000);

  const confirmedBookings = await Booking.find({
    status: "CONFIRMED",
  }).populate("slotId");

  let bestRecommendation = null;

  for (const booking of confirmedBookings) {
    if (!booking.slotId) continue;

    const slot = booking.slotId;
    const slotTime = getSlotDateTime(slot);

    if (!slot.isActive) continue;
    if (slot.bookedCount >= slot.capacity) continue;
    if (slotTime <= now || slotTime > maxTime) continue;

    const score = calculateAddressScore(address, booking.address);

    if (score < 50) continue;

    const timeDifferenceHours =
      (slotTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    const timeScore = Math.max(
      0,
      Math.round(20 - (timeDifferenceHours / THRESHOLD_HOURS) * 20),
    );

    const finalScore = Math.min(score + timeScore, 100);

    if (!bestRecommendation || finalScore > bestRecommendation.matchScore) {
      const reward = getReward(finalScore);

      bestRecommendation = {
        slot: slot.toObject(),
        recommendationType: "ADDRESS_GROUPED_DELIVERY",
        matchScore: finalScore,
        discount: reward.discount,
        ecoPoints: reward.ecoPoints,
        tag: reward.tag,
        reason:
          "A nearby delivery is already scheduled within the next 48 hours. Choosing this slot helps optimize delivery routing.",
      };
    }
  }

  return bestRecommendation;
};
