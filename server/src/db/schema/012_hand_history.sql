-- Hand History table for Hand Recorder feature (TC042)

CREATE TABLE IF NOT EXISTS hand_history (
  id                INT UNSIGNED     AUTO_INCREMENT PRIMARY KEY,
  user_id           INT UNSIGNED     NOT NULL,
  created_at        DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  game_type         ENUM('cash','tournament') NOT NULL DEFAULT 'cash',
  stakes            VARCHAR(20)      NULL,
  table_format      ENUM('6max','9max','other') NULL,
  position          VARCHAR(10)      NOT NULL,

  hero_hand         VARCHAR(10)      NOT NULL,
  stack_depth_bb    DECIMAL(8,2)     NULL,

  preflop_action    TEXT             NULL,
  postflop_action   TEXT             NULL,

  result_amount     DECIMAL(10,2)    NULL,
  result_type       ENUM('win','loss','chop') NULL,

  tags              JSON             NULL,
  notes             TEXT             NULL,

  CONSTRAINT fk_hh_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_hh_user_id       (user_id),
  INDEX idx_hh_created_at    (created_at),
  INDEX idx_hh_game_type     (game_type),
  INDEX idx_hh_stakes        (stakes)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
