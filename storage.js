// ===== STORAGE =====
const STORAGE_KEY = 'jovi_lab_reviews';

function loadReviews() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

function saveReviews(reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch(e) { console.error('Storage error:', e); }
}

function addReview(review) {
  const reviews = loadReviews();
  reviews.push(review);
  saveReviews(reviews);
  return reviews;
}

function updateReview(review) {
  const reviews = loadReviews();
  const idx = reviews.findIndex(r => r.id === review.id);
  if (idx !== -1) reviews[idx] = review;
  else reviews.push(review);
  saveReviews(reviews);
  return reviews;
}

function deleteReview(id) {
  const reviews = loadReviews().filter(r => r.id !== id);
  saveReviews(reviews);
  return reviews;
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
