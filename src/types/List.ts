import type {
  BuildQueryResult,
  DBQueryConfig,
  ExtractTablesWithRelations,
  InferSelectModel,
} from "drizzle-orm";
import * as schema from "@/lib/db/schema";

type Schema = typeof schema;
type TSchema = ExtractTablesWithRelations<Schema>;

export type IncludeRelation<TableName extends keyof TSchema> = DBQueryConfig<
  "one" | "many",
  boolean,
  TSchema,
  TSchema[TableName]
>["with"];

// from https://github.com/drizzle-team/drizzle-orm/issues/695#issuecomment-1881454650
export type InferResultType<
  TableName extends keyof TSchema,
  With extends IncludeRelation<TableName> | undefined = undefined,
> = BuildQueryResult<
  TSchema,
  TSchema[TableName],
  {
    with: With;
  }
>;

export type Item = InferSelectModel<typeof schema.items>;
export type Category = InferResultType<"categories", { items: true }>;
export type List = InferResultType<
  "lists",
  { categories: { with: { items: true } } }
>;

export type CategoryWithoutItems = Omit<Category, "items">;
