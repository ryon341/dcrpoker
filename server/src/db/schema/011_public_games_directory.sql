-- Migration 011: Public Venues and Public Games Directory
-- Run: mysql -u root "-pPhinFan#2026" dcrpoker < 011_public_games_directory.sql

CREATE TABLE IF NOT EXISTS `public_venues` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(200)    NOT NULL,
  `city`       VARCHAR(120)    NOT NULL,
  `state`      VARCHAR(80)     NULL,
  `address`    VARCHAR(255)    NULL,
  `website`    VARCHAR(500)    NULL,
  `notes`      TEXT            NULL,
  `is_active`  TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pv_city`  (`city`),
  KEY `idx_pv_state` (`state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `public_games` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `venue_id`      BIGINT UNSIGNED NOT NULL,
  `title`         VARCHAR(200)    NOT NULL,
  `game_type`     VARCHAR(60)     NULL,
  `stake`         VARCHAR(80)     NULL,
  `schedule_text` VARCHAR(300)    NULL,
  `buy_in`        VARCHAR(80)     NULL,
  `is_tournament` TINYINT(1)      NOT NULL DEFAULT 0,
  `notes`         TEXT            NULL,
  `is_active`     TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_pg_venue`      (`venue_id`),
  KEY `idx_pg_game_type`  (`game_type`),
  KEY `idx_pg_tournament` (`is_tournament`),
  CONSTRAINT `fk_pg_venue` FOREIGN KEY (`venue_id`) REFERENCES `public_venues` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
