import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export const researchRequests = pgTable('research_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  topic: text('topic').notNull(),
  purpose: text('purpose').notNull(),
  focus: text('focus'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const researchSessions = pgTable(
  'research_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull(),
    topic: text('topic').notNull(),
    purpose: text('purpose').notNull(),
    focus: text('focus'),
    sourceTypes: jsonb('source_types').$type<string[]>().notNull(),
    researchGoal: text('research_goal').notNull(),
    searchQueries: jsonb('search_queries').$type<string[]>().notNull(),
    keywords: jsonb('keywords').$type<string[]>().notNull(),
    recommendedSources: jsonb('recommended_sources')
      .$type<string[]>()
      .notNull(),
    results: jsonb('results').$type<unknown[]>().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('research_sessions_user_id_idx').on(table.userId)],
);

export const userApiKeys = pgTable(
  'user_api_keys',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().unique(),
    geminiApiKey: text('gemini_api_key'),
    exaApiKey: text('exa_api_key'),
    maxSources: integer('max_sources').notNull().default(5),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [index('user_api_keys_user_id_idx').on(table.userId)],
);

export type ResearchRequest = typeof researchRequests.$inferSelect;
export type NewResearchRequest = typeof researchRequests.$inferInsert;
export type ResearchSession = typeof researchSessions.$inferSelect;
export type NewResearchSession = typeof researchSessions.$inferInsert;
export type UserApiKeys = typeof userApiKeys.$inferSelect;
export type NewUserApiKeys = typeof userApiKeys.$inferInsert;
