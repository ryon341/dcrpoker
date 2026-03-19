-- 006_rsvp_and_waitlist_fields.sql
-- RSVP fields on game_invites, capacity on games, and optional inbound SMS log

-- Extend games with capacity + seat assignment flag
ALTER TABLE games
  ADD COLUMN max_players INT NOT NULL DEFAULT 9,
  ADD COLUMN seat_assignment_enabled TINYINT(1) NOT NULL DEFAULT 0;

-- Extend game_invites with RSVP state
ALTER TABLE game_invites
  ADD COLUMN rsvp_status        VARCHAR(30) NOT NULL DEFAULT 'invited',
  ADD COLUMN seat_preference    VARCHAR(20) NULL,
  ADD COLUMN assigned_seat_number INT       NULL,
  ADD COLUMN waitlist_position  INT         NULL;

-- Indexes for RSVP lookups
ALTER TABLE game_invites
  ADD INDEX idx_gi_rsvp_status      (rsvp_status),
  ADD INDEX idx_gi_waitlist_pos     (waitlist_position);

-- Optional inbound SMS log for debugging
CREATE TABLE IF NOT EXISTS sms_inbound_logs (
  id                BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  from_phone        VARCHAR(30)      NOT NULL,
  to_phone          VARCHAR(30)      NOT NULL,
  message_body      TEXT             NOT NULL,
  parsed_command    VARCHAR(30)      NULL,
  parsed_value      VARCHAR(30)      NULL,
  user_id           BIGINT UNSIGNED  NULL,
  game_id           BIGINT UNSIGNED  NULL,
  game_invite_id    BIGINT UNSIGNED  NULL,
  status            VARCHAR(30)      NOT NULL DEFAULT 'processed',
  error_message     VARCHAR(255)     NULL,
  created_at        DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_sms_inbound_from  (from_phone),
  INDEX idx_sms_inbound_user  (user_id),
  INDEX idx_sms_inbound_game  (game_id),
  INDEX idx_sms_inbound_created (created_at)
);
