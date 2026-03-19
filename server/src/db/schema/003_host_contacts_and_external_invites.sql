-- =============================================================
-- DCR Poker — Host Contacts + External Invites
-- 003_host_contacts_and_external_invites.sql
-- =============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- -------------------------------------------------------------
-- host_contacts
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `host_contacts` (
  `id`                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `host_user_id`       BIGINT UNSIGNED NOT NULL,
  `display_name`       VARCHAR(120)    NOT NULL,
  `phone`              VARCHAR(30)     NULL,
  `email`              VARCHAR(255)    NULL,
  `source`             VARCHAR(30)     NOT NULL DEFAULT 'manual',
  `status`             VARCHAR(30)     NOT NULL DEFAULT 'imported',
  `notes`              VARCHAR(255)    NULL,
  `registered_user_id` BIGINT UNSIGNED NULL,
  `created_at`         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_hc_host_user_id`       (`host_user_id`),
  KEY `idx_hc_status`             (`status`),
  KEY `idx_hc_phone`              (`phone`),
  KEY `idx_hc_email`              (`email`),
  KEY `idx_hc_registered_user_id` (`registered_user_id`),
  CONSTRAINT `fk_hc_host_user`       FOREIGN KEY (`host_user_id`)       REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_hc_registered_user` FOREIGN KEY (`registered_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------------
-- external_invites
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `external_invites` (
  `id`                 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `host_user_id`       BIGINT UNSIGNED NOT NULL,
  `host_contact_id`    BIGINT UNSIGNED NULL,
  `game_id`            BIGINT UNSIGNED NULL,
  `invite_code`        VARCHAR(100)    NOT NULL,
  `invite_url`         VARCHAR(500)    NOT NULL,
  `channel`            VARCHAR(20)     NOT NULL DEFAULT 'manual',
  `status`             VARCHAR(30)     NOT NULL DEFAULT 'generated',
  `recipient_phone`    VARCHAR(30)     NULL,
  `recipient_email`    VARCHAR(255)    NULL,
  `registered_user_id` BIGINT UNSIGNED NULL,
  `accepted_at`        DATETIME        NULL,
  `expires_at`         DATETIME        NULL,
  `created_at`         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_ei_invite_code`       (`invite_code`),
  KEY `idx_ei_host_user_id`            (`host_user_id`),
  KEY `idx_ei_host_contact_id`         (`host_contact_id`),
  KEY `idx_ei_game_id`                 (`game_id`),
  KEY `idx_ei_status`                  (`status`),
  KEY `idx_ei_recipient_phone`         (`recipient_phone`),
  KEY `idx_ei_recipient_email`         (`recipient_email`),
  CONSTRAINT `fk_ei_host_user`         FOREIGN KEY (`host_user_id`)       REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ei_host_contact`      FOREIGN KEY (`host_contact_id`)    REFERENCES `host_contacts` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ei_game`              FOREIGN KEY (`game_id`)            REFERENCES `games` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ei_registered_user`   FOREIGN KEY (`registered_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
