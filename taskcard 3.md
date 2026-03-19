Taskcard 003 — Create Initial MySQL Schema for Core Access Control
Goal

Create the first database schema for DCR Poker in C:\Users\ryon3\dcrpoker\server.

This task should establish the core relational foundation for:

users

roles

host/player relationships

games

game invitations

This is the first real application schema. Keep it tightly scoped to access control and game visibility only.

Do not build bankroll, blog, training, charts, or public card room tables yet.

Scope for This Task

Create only the following tables:

users

roles

user_roles

games

host_players

game_invites

Optional only if needed for clarity:

external_invites

If external_invites is added, keep it minimal.

Product Rules to Enforce
Users

Any person can register, even without an invite

Phone is required

Email is optional

Login will eventually support either phone or email, but auth is not part of this task

Roles

System supports:

player

host

admin

A user may potentially hold multiple roles.

Host player lists

Each host has a private player list

Only that host can manage their own list

Hosts cannot see other hosts’ lists

A player can belong to many hosts’ lists

Hosts can add or remove players

Games

Games are private by default

A game belongs to a host

A game is only visible to invited players

Public games will be handled later, not in this task

Game invites

A player may be invited to many games

A game may have many invited players

Game visibility is controlled by game_invites

Folder / File Requirements

Inside server, create:

src/
  db/
    migrations/
    schema/

Create a SQL file for the initial schema, for example:

src/db/schema/001_initial_core_schema.sql

If you prefer a migration runner script, keep it very simple. Raw SQL is acceptable and preferred here.

Database Design Requirements
1. roles

Purpose: master list of system roles

Fields:

id bigint unsigned primary key auto_increment

name varchar(50) not null unique

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Seed values:

player

host

admin

2. users

Purpose: all registered users

Fields:

id bigint unsigned primary key auto_increment

phone varchar(30) not null unique

email varchar(255) null unique

display_name varchar(120) not null

username varchar(60) null unique

is_active tinyint(1) not null default 1

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Notes:

allow email to be null

allow username to be null

keep this schema auth-agnostic for now

do not add password fields yet unless your backend scaffold absolutely requires it; if added, keep it nullable and note that auth comes later

3. user_roles

Purpose: many-to-many between users and roles

Fields:

id bigint unsigned primary key auto_increment

user_id bigint unsigned not null

role_id bigint unsigned not null

created_at datetime not null default current_timestamp

Constraints:

foreign key to users(id)

foreign key to roles(id)

unique composite on (user_id, role_id)

4. games

Purpose: host-created private games

Fields:

id bigint unsigned primary key auto_increment

host_user_id bigint unsigned not null

title varchar(150) not null

description text null

location_name varchar(150) null

address_line_1 varchar(255) null

address_line_2 varchar(255) null

city varchar(120) null

state varchar(80) null

postal_code varchar(20) null

game_type varchar(50) null

stakes_label varchar(50) null

starts_at datetime null

ends_at datetime null

status varchar(30) not null default 'draft'

visibility varchar(30) not null default 'private'

is_active tinyint(1) not null default 1

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Constraints:

foreign key to users(id) on host_user_id

Notes:

visibility should default to private

public games come later, but keeping the field now is acceptable

recommended status values for now:

draft

published

cancelled

completed

5. host_players

Purpose: private roster relationship between a host and a player

Fields:

id bigint unsigned primary key auto_increment

host_user_id bigint unsigned not null

player_user_id bigint unsigned not null

status varchar(30) not null default 'active'

added_at datetime not null default current_timestamp

removed_at datetime null

notes varchar(255) null

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Constraints:

foreign key to users(id) on host_user_id

foreign key to users(id) on player_user_id

unique composite on (host_user_id, player_user_id)

Notes:

this table represents the host’s private player list

status can start with:

active

removed

6. game_invites

Purpose: players invited to specific games

Fields:

id bigint unsigned primary key auto_increment

game_id bigint unsigned not null

host_user_id bigint unsigned not null

player_user_id bigint unsigned not null

status varchar(30) not null default 'invited'

invited_at datetime not null default current_timestamp

responded_at datetime null

created_at datetime not null default current_timestamp

updated_at datetime not null default current_timestamp on update current_timestamp

Constraints:

foreign key to games(id)

foreign key to users(id) on host_user_id

foreign key to users(id) on player_user_id

unique composite on (game_id, player_user_id)

Recommended status values:

invited

accepted

declined

removed

Important:
This table is what determines whether a player can see a private game.

7. Optional: external_invites

Add only if it feels useful now and does not complicate the task.

Suggested fields:

id

host_user_id

game_id nullable

recipient_email nullable

recipient_phone nullable

invite_code unique

invite_url

status

registered_user_id nullable

timestamps

If there is any doubt, skip this table for now and add it later.

Index Requirements

Add indexes for likely lookups:

users

unique index on phone

unique index on email

unique index on username

games

index on host_user_id

index on status

index on visibility

index on starts_at

host_players

unique on (host_user_id, player_user_id)

index on player_user_id

index on status

game_invites

unique on (game_id, player_user_id)

index on player_user_id

index on host_user_id

index on status

Migration / Execution Requirements

Provide a safe way to run this schema against MySQL.

Acceptable options:

one SQL file plus exact mysql command to import it

a simple Node script that executes the SQL file

Simplest preferred approach:

raw SQL file

exact command to run it

Example style only:

mysql -u root -p dcrpoker < src/db/schema/001_initial_core_schema.sql

Use whatever path syntax makes sense for Windows.

Seed Requirements

In the same SQL file, or in a separate seed file, insert default roles:

player

host

admin

Use an idempotent insert pattern if practical.

Validation Criteria

Task is complete only if all of the following are true:

Schema

all required tables are created successfully

foreign keys are valid

indexes are created

roles are seeded

Integrity

one host cannot have duplicate copies of the same player in host_players

one player cannot be invited twice to the same game

users can exist without an email

games default to private visibility

Deliverable

Return:

final SQL file contents

exact command used to run the schema

output of SHOW TABLES;

sample DESCRIBE output for each table

confirmation that role seed rows exist

Constraints

do not add bankroll tables yet

do not add chart tables yet

do not add blog/training tables yet

do not add auth/session tables yet

do not add public card room tables yet

keep schema limited to core user/host/game/invite relationships

Notes

This task is about getting the relational backbone right before API work begins.

After this, Taskcard 004 should be:
Create backend seed/test data and read-only API endpoints for users, games, host player lists, and game invites.