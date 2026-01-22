import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  role: text('role'),  
  field_one: text('field_one'),
  field_two: text('field_two'),
  field_three: text('field_three'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const checkinLogs = pgTable('checkin_logs', {
  id: serial('id').primaryKey(),

  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  checkin_time: timestamp('checkin_time', { withTimezone: true }),
  checkout_time: timestamp('checkout_time', { withTimezone: true }),
  location: text('location'),
  deviceId: text('device_id'),
  note: text('note'),
  is_send: boolean('is_send').default(false),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type CheckinLogs = typeof checkinLogs.$inferSelect;
export type NewCheckinLogs = typeof checkinLogs.$inferInsert;

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
}
