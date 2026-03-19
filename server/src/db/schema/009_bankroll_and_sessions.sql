-- 009_bankroll_and_sessions.sql
-- Poker session tracking and bankroll management

CREATE TABLE IF NOT EXISTS poker_sessions (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id               BIGINT UNSIGNED NOT NULL,
  played_at             DATETIME        NOT NULL,
  game_type             VARCHAR(30)     NOT NULL DEFAULT 'cash',
  stakes_label          VARCHAR(50)     NULL,
  location_name         VARCHAR(150)    NULL,
  buy_in_amount_cents   INT             NOT NULL DEFAULT 0,
  cash_out_amount_cents INT             NOT NULL DEFAULT 0,
  profit_loss_cents     INT             NOT NULL DEFAULT 0,
  hours_played_decimal  DECIMAL(6,2)    NOT NULL DEFAULT 0.00,
  notes                 TEXT            NULL,
  created_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_poker_sessions_user FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_ps_user_id   (user_id),
  INDEX idx_ps_played_at (played_at),
  INDEX idx_ps_game_type (game_type),
  INDEX idx_ps_stakes    (stakes_label)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bankroll_adjustments (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id          BIGINT UNSIGNED NOT NULL,
  amount_cents     INT             NOT NULL,
  adjustment_type  VARCHAR(30)     NOT NULL DEFAULT 'manual',
  description      VARCHAR(255)    NULL,
  created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_bankroll_adj_user FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_ba_user_id         (user_id),
  INDEX idx_ba_adjustment_type (adjustment_type),
  INDEX idx_ba_created_at      (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
