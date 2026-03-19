-- =============================================================
-- DCR Poker — Core Test/Seed Data
-- 002_seed_core_test_data.sql
-- =============================================================

-- -------------------------------------------------------------
-- Users (idempotent via ON DUPLICATE KEY)
-- -------------------------------------------------------------
INSERT INTO `users` (`id`, `phone`, `email`, `display_name`, `username`, `is_active`) VALUES
  (1,  '+15550000001', 'admin@dcrpoker.dev',   'Admin User',   'admin',     1),
  (2,  '+15550000002', 'host1@dcrpoker.dev',   'Host One',     'host_one',  1),
  (3,  '+15550000003', 'host2@dcrpoker.dev',   'Host Two',     'host_two',  1),
  (4,  '+15550000004', NULL,                   'Player One',   'player1',   1),
  (5,  '+15550000005', NULL,                   'Player Two',   'player2',   1),
  (6,  '+15550000006', 'p3@example.com',       'Player Three', 'player3',   1),
  (7,  '+15550000007', NULL,                   'Player Four',  'player4',   1),
  (8,  '+15550000008', 'p5@example.com',       'Player Five',  'player5',   1)
ON DUPLICATE KEY UPDATE
  `display_name` = VALUES(`display_name`),
  `username`     = VALUES(`username`);

-- -------------------------------------------------------------
-- User roles
-- roles: 1=player, 2=host, 3=admin
-- -------------------------------------------------------------
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
  (1, 3),  -- admin  → admin
  (2, 2),  -- host1  → host
  (2, 1),  -- host1  → player (hosts can play too)
  (3, 2),  -- host2  → host
  (3, 1),  -- host2  → player
  (4, 1),  -- player1 → player
  (5, 1),  -- player2 → player
  (6, 1),  -- player3 → player
  (7, 1),  -- player4 → player
  (8, 1)   -- player5 → player
ON DUPLICATE KEY UPDATE `role_id` = VALUES(`role_id`);

-- -------------------------------------------------------------
-- Games
-- host_user_id 2 = Host One, 3 = Host Two
-- -------------------------------------------------------------
INSERT INTO `games` (`id`, `host_user_id`, `title`, `description`, `location_name`, `city`, `state`, `game_type`, `stakes_label`, `starts_at`, `status`, `visibility`) VALUES
  (1, 2, 'Tuesday Night Cash Game',  'Regular weekly home game.',         'Host One House',   'Dallas',   'TX', 'Cash',        '$1/$2 NLH',  '2026-03-24 19:00:00', 'published', 'private'),
  (2, 2, 'March Deep Stack Tourney', 'Monthly tournament, $100 buy-in.',  'Host One House',   'Dallas',   'TX', 'Tournament',  '$100 buy-in','2026-03-28 14:00:00', 'published', 'private'),
  (3, 2, 'April Draft Game',         NULL,                                 NULL,               'Dallas',   'TX', 'Cash',        '$2/$5 NLH',  '2026-04-07 19:00:00', 'draft',     'private'),
  (4, 3, 'Host Two Friday Game',     'BYOB, max 9 players.',              'Host Two House',   'Austin',   'TX', 'Cash',        '$1/$3 NLH',  '2026-03-21 20:00:00', 'published', 'private')
ON DUPLICATE KEY UPDATE
  `title`  = VALUES(`title`),
  `status` = VALUES(`status`);

-- -------------------------------------------------------------
-- Host players
-- Host One (2): players 1,2,3
-- Host Two (3): players 3,4,5
-- -------------------------------------------------------------
INSERT INTO `host_players` (`host_user_id`, `player_user_id`, `status`) VALUES
  (2, 4, 'active'),  -- host1 → player1
  (2, 5, 'active'),  -- host1 → player2
  (2, 6, 'active'),  -- host1 → player3
  (3, 6, 'active'),  -- host2 → player3 (overlapping)
  (3, 7, 'active'),  -- host2 → player4
  (3, 8, 'active')   -- host2 → player5
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- -------------------------------------------------------------
-- Game invites
-- Game 1 (host1, Tuesday): players 1-3
-- Game 2 (host1, March Tourney): players 1,2
-- Game 4 (host2, Friday): players 3-5
-- -------------------------------------------------------------
INSERT INTO `game_invites` (`game_id`, `host_user_id`, `player_user_id`, `status`, `responded_at`) VALUES
  (1, 2, 4, 'accepted',  '2026-03-18 10:00:00'),  -- game1, player1 accepted
  (1, 2, 5, 'accepted',  '2026-03-18 11:00:00'),  -- game1, player2 accepted
  (1, 2, 6, 'invited',   NULL),                    -- game1, player3 pending
  (2, 2, 4, 'invited',   NULL),                    -- game2, player1 pending
  (2, 2, 5, 'declined',  '2026-03-19 09:00:00'),  -- game2, player2 declined
  (4, 3, 6, 'accepted',  '2026-03-18 15:00:00'),  -- game4, player3 accepted
  (4, 3, 7, 'invited',   NULL),                    -- game4, player4 pending
  (4, 3, 8, 'invited',   NULL)                     -- game4, player5 pending
ON DUPLICATE KEY UPDATE
  `status`       = VALUES(`status`),
  `responded_at` = VALUES(`responded_at`);
