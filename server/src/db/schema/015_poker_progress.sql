-- Migration 015: Poker Challenge Progress
-- Run: mysql -u root "-pPhinFan#2026" dcrpoker < 015_poker_progress.sql

-- Main progression progress (one row per user)
CREATE TABLE IF NOT EXISTS `poker_progress` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    BIGINT UNSIGNED NOT NULL,
  `progress`   JSON            NOT NULL,
  `updated_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_poker_progress_user` (`user_id`),
  CONSTRAINT `fk_poker_progress_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Daily challenge progress (one row per user per day)
CREATE TABLE IF NOT EXISTS `poker_daily_progress` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    BIGINT UNSIGNED NOT NULL,
  `daily_id`   VARCHAR(16)     NOT NULL,
  `progress`   JSON            NOT NULL,
  `updated_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_poker_daily_user_day` (`user_id`, `daily_id`),
  KEY `idx_poker_daily_user` (`user_id`),
  CONSTRAINT `fk_poker_daily_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
