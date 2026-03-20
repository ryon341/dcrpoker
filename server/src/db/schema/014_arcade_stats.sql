-- Migration 014: Arcade Stats
-- Run: mysql -u root "-pPhinFan#2026" dcrpoker < 014_arcade_stats.sql

CREATE TABLE IF NOT EXISTS `arcade_stats` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`        BIGINT UNSIGNED NOT NULL,
  `game_id`        VARCHAR(30)     NOT NULL,
  `high_score`     INT UNSIGNED    NOT NULL DEFAULT 0,
  `best_streak`    INT UNSIGNED    NOT NULL DEFAULT 0,
  `total_plays`    INT UNSIGNED    NOT NULL DEFAULT 0,
  `last_score`     INT             NULL,
  `last_played_at` DATETIME        NULL,
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_arcade_user_game` (`user_id`, `game_id`),
  KEY `idx_arcade_user` (`user_id`),
  CONSTRAINT `fk_arcade_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
