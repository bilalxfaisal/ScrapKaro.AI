import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const researchRequests = pgTable('research_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  topic: text('topic').notNull(),
  purpose: text('purpose').notNull(),
  focus: text('focus'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type ResearchRequest = typeof researchRequests.$inferSelect;
export type NewResearchRequest = typeof researchRequests.$inferInsert;
