-- Migration 010: Notifications
-- Run: mysql -u root "-pPhinFan#2026" dcrpoker < 010_notifications.sql

CREATE TABLE IF NOT EXISTS `notifications` (
  `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`             BIGINT UNSIGNED NOT NULL,
  `type`                VARCHAR(60)     NOT NULL,
  `title`               VARCHAR(200)    NOT NULL,
  `body`                TEXT            NOT NULL,
  `related_entity_type` VARCHAR(60)     NULL,
  `related_entity_id`   BIGINT UNSIGNED NULL,
  `is_read`             TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_notif_user`    (`user_id`),
  KEY `idx_notif_is_read` (`is_read`),
  CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
