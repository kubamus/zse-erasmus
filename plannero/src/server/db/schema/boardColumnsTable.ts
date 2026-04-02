import {
  decimal,
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm/relations";
import { boardsTable } from "./boardsTable";
import { issuesTable } from "./issuesTable";

export const boardColumnsTable = mysqlTable(
  "board_column",
  {
    id: varchar("id", { length: 36 }).primaryKey(),
    boardId: varchar("board_id", { length: 36 })
      .notNull()
      .references(() => boardsTable.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 60 }).notNull(),
    position: decimal("position", { precision: 20, scale: 6 }).notNull(),
    wipLimit: int("wip_limit"),
    isDoneColumn: boolean("is_done_column").default(false).notNull(),
    createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { fsp: 3 })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("board_column_boardId_position_idx").on(table.boardId, table.position)],
);

export const boardColumnRelations = relations(boardColumnsTable, ({ one, many }) => ({
  board: one(boardsTable, {
    fields: [boardColumnsTable.boardId],
    references: [boardsTable.id],
  }),
  issues: many(issuesTable),
}));
