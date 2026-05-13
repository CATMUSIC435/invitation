import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';

// Removed unused users and checkin_logs tables

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  image_url: text('image_url'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;

export const avatarTemplates = pgTable('avatar_templates', {
  id: serial('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  content: text('content'),
  image_url: text('image_url'),
  start_date: timestamp('start_date', { withTimezone: true }),
  end_date: timestamp('end_date', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type AvatarTemplate = typeof avatarTemplates.$inferSelect;
export type NewAvatarTemplate = typeof avatarTemplates.$inferInsert;

export const invitationTemplates = pgTable('invitation_templates', {
  id: serial('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  title: text('title'),
  description: text('description'),
  background_url: text('background_url'),
  text_position_x: integer('text_position_x').default(0),
  text_position_y: integer('text_position_y').default(0),
  avatar_position_x: integer('avatar_position_x').default(450),
  avatar_position_y: integer('avatar_position_y').default(450),
  has_avatar: boolean('has_avatar').default(true),
  has_company: boolean('has_company').default(true),
  save_user_info: boolean('save_user_info').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export type InvitationTemplate = typeof invitationTemplates.$inferSelect;
export type NewInvitationTemplate = typeof invitationTemplates.$inferInsert;
