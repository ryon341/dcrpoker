-- =============================================================
-- DCR Poker — Initial Core Schema
-- 001_initial_core_schema.sql
-- =============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------
-- roles
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(50)     NOT NULL,
  `created_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_roles_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- users
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `phone`        VARCHAR(30)     NOT NULL,
  `email`        VARCHAR(255)    NULL,
  `display_name` VARCHAR(120)    NOT NULL,
  `username`     VARCHAR(60)     NULL,
  `is_active`    TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_phone`    (`phone`),
  UNIQUE KEY `uq_users_email`    (`email`),
  UNIQUE KEY `uq_users_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- user_roles
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_roles` (
  `id`         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`    BIGINT UNSIGNED NOT NULL,
  `role_id`    BIGINT UNSIGNED NOT NULL,
  `created_at` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_roles_user_role` (`user_id`, `role_id`),
  CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- games
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `games` (
  `id`             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `host_user_id`   BIGINT UNSIGNED NOT NULL,
  `title`          VARCHAR(150)    NOT NULL,
  `description`    TEXT            NULL,
  `location_name`  VARCHAR(150)    NULL,
  `address_line_1` VARCHAR(255)    NULL,
  `address_line_2` VARCHAR(255)    NULL,
  `city`           VARCHAR(120)    NULL,
  `state`          VARCHAR(80)     NULL,
  `postal_code`    VARCHAR(20)     NULL,
  `game_type`      VARCHAR(50)     NULL,
  `stakes_label`   VARCHAR(50)     NULL,
  `starts_at`      DATETIME        NULL,
  `ends_at`        DATETIME        NULL,
  `status`         VARCHAR(30)     NOT NULL DEFAULT 'draft',
  `visibility`     VARCHAR(30)     NOT NULL DEFAULT 'private',
  `is_active`      TINYINT(1)      NOT NULL DEFAULT 1,
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_games_host_user_id` (`host_user_id`),
  KEY `idx_games_status`       (`status`),
  KEY `idx_games_visibility`   (`visibility`),
  KEY `idx_games_starts_at`    (`starts_at`),
  CONSTRAINT `fk_games_host_user` FOREIGN KEY (`host_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- host_players
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `host_players` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `host_user_id`    BIGINT UNSIGNED NOT NULL,
  `player_user_id`  BIGINT UNSIGNED NOT NULL,
  `status`          VARCHAR(30)     NOT NULL DEFAULT 'active',
  `added_at`        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `removed_at`      DATETIME        NULL,
  `notes`           VARCHAR(255)    NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_host_players_host_player` (`host_user_id`, `player_user_id`),
  KEY `idx_host_players_player_user_id` (`player_user_id`),
  KEY `idx_host_players_status`         (`status`),
  CONSTRAINT `fk_host_players_host`   FOREIGN KEY (`host_user_id`)   REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_host_players_player` FOREIGN KEY (`player_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- game_invites
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `game_invites` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `game_id`         BIGINT UNSIGNED NOT NULL,
  `host_user_id`    BIGINT UNSIGNED NOT NULL,
  `player_user_id`  BIGINT UNSIGNED NOT NULL,
  `status`          VARCHAR(30)     NOT NULL DEFAULT 'invited',
  `invited_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `responded_at`    DATETIME        NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_game_invites_game_player` (`game_id`, `player_user_id`),
  KEY `idx_game_invites_player_user_id` (`player_user_id`),
  KEY `idx_game_invites_host_user_id`   (`host_user_id`),
  KEY `idx_game_invites_status`         (`status`),
  CONSTRAINT `fk_game_invites_game`   FOREIGN KEY (`game_id`)        REFERENCES `games` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_game_invites_host`   FOREIGN KEY (`host_user_id`)   REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_game_invites_player` FOREIGN KEY (`player_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================
-- Seed: roles (idempotent)
-- =============================================================
INSERT INTO `roles` (`name`) VALUES
  ('player'),
  ('host'),
  ('admin')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
