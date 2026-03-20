-- Add review_status to hand_history (TC044)
ALTER TABLE hand_history
  ADD COLUMN review_status VARCHAR(20) NOT NULL DEFAULT 'none',
  ADD INDEX idx_hh_review_status (review_status);
