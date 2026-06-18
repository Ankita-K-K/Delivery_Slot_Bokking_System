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

const levenshteinDistance = (a = "", b = "") => {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
};

const areWordsSimilar = (wordA, wordB) => {
  if (!wordA || !wordB) return false;

  if (wordA === wordB) return true;

  if (wordA.includes(wordB) || wordB.includes(wordA)) return true;

  const distance = levenshteinDistance(wordA, wordB);
  const maxLength = Math.max(wordA.length, wordB.length);

  return distance / maxLength <= 0.35;
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

  // Same pincode is strong, but not mandatory
  if (inputPincode && bookedPincode && inputPincode === bookedPincode) {
    score += 25;
  }

  // Same known area is strong
  if (inputArea && bookedArea && inputArea === bookedArea) {
    score += 35;
  }

  // Fuzzy keyword match
  let matchedWords = 0;

  for (const inputWord of inputWords) {
    const matched = bookedWords.some((bookedWord) =>
      areWordsSimilar(inputWord, bookedWord),
    );

    if (matched) matchedWords++;
  }

  const keywordScore =
    inputWords.length === 0
      ? 0
      : Math.round((matchedWords / inputWords.length) * 40);

  score += keywordScore;

  // Loose fallback: if full address contains similar area-like word
  if (score < 40) {
    const looseMatch = inputWords.some((inputWord) =>
      bookedWords.some((bookedWord) => areWordsSimilar(inputWord, bookedWord)),
    );

    if (looseMatch) score += 20;
  }

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
    if (slotTime <= now) continue;

    const addressScore = calculateAddressScore(address, booking.address);

    if (addressScore < 35) continue;

    if (!bestRecommendation || addressScore > bestRecommendation.matchScore) {
      const reward = getReward(addressScore);

      bestRecommendation = {
        slot: slot.toObject(),
        recommendationType: "ADDRESS_BASED_RECOMMENDATION",
        matchScore: addressScore,
        discount: reward.discount,
        ecoPoints: reward.ecoPoints,
        tag: reward.tag,
        reason:
          "A delivery is already scheduled near this address. Choosing this slot helps group nearby deliveries.",
      };
    }
  }

  return bestRecommendation;
};
