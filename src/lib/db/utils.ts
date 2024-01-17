import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db } from ".";
import { sql } from "drizzle-orm";
import { categories, items, lists, users, usersLists } from "./schema";

export const isListNameExistsForUser = async (
  userId: string,
  listName: string,
) => {
  const userLists = await db
    .select({ userId: usersLists.userId })
    .from(usersLists)
    .where(and(eq(usersLists.userId, userId), eq(lists.name, listName)))
    .innerJoin(lists, eq(usersLists.listId, lists.id));

  return userLists.length > 0;
};

export const createListForUser = async (userId: string, listName: string) => {
  let newListIdResult = 0;
  await db.transaction(async (tx) => {
    const { newListId } = (
      await tx
        .insert(lists)
        .values({ name: listName })
        .returning({ newListId: lists.id })
    )[0];

    // insert into junction table usersLists
    await tx.insert(usersLists).values({
      userId: userId,
      listId: newListId,
    });

    // update mainListId if this is the user's first list
    await tx
      .update(users)
      .set({ mainListId: newListId })
      .where(and(eq(users.id, userId), isNull(users.mainListId)));

    newListIdResult = newListId;
  });

  return newListIdResult;
};

export const getUserMainListId = async (userId: string) => {
  const { mainListId } = (
    await db
      .select({ mainListId: users.mainListId })
      .from(users)
      .where(eq(users.id, userId))
  )[0];
  return mainListId;
};

export const getAllItemsInList = async (userId: string, listId: number) => {
  const userWithList = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {},
    with: {
      lists: {
        columns: {},
        where: eq(usersLists.listId, listId),
        with: {
          list: {
            with: {
              categories: {
                with: {
                  items: {
                    orderBy: [asc(items.name)],
                  },
                },
                orderBy: [asc(categories.position)],
              },
            },
          },
        },
      },
    },
  });
  return userWithList?.lists[0]?.list;
};

export const getAllCategoriesInList = async (
  userId: string,
  listId: number,
) => {
  const userWithList = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {},
    with: {
      lists: {
        columns: {},
        where: eq(usersLists.listId, listId),
        with: {
          list: {
            with: {
              categories: {
                orderBy: [asc(categories.position)],
              },
            },
          },
        },
      },
    },
  });
  return userWithList?.lists[0]?.list;
};

export const createCategoryInList = async (
  listId: number,
  categoryName: string,
) => {
  const lastCategoryPosition =
    (
      await db
        .select()
        .from(categories)
        .where(eq(categories.listId, listId))
        .orderBy(desc(categories.position))
        .limit(1)
    )[0]?.position ?? 0;

  await db.insert(categories).values({
    listId,
    name: categoryName,
    position: lastCategoryPosition + 1,
  });
};

export const createItemInCategory = async (
  categoryId: number,
  itemName: string,
) => {
  await db.insert(items).values({ name: itemName, categoryId });
};

export const addItemToShoppingList = async (
  userId: string,
  listId: number,
  itemId: number,
) => {
  await db.execute(sql`
  UPDATE items
  SET 
    "isInShoppingList" = true
  FROM 
    categories
    INNER JOIN lists ON categories."listId" = lists.id
    INNER JOIN "usersLists" ON "usersLists"."listId" = lists.id
  WHERE "usersLists"."userId" = ${userId}
    AND lists.id = ${listId}
    AND items."categoryId" = categories.id
    AND items.id = ${itemId};
  `);
};

export const pickUpItemInShoppingList = async (
  userId: string,
  listId: number,
  itemId: number,
) => {
  await db.execute(sql`
  UPDATE items
  SET 
    "isPickedUp" = true
  FROM 
    categories
    INNER JOIN lists ON categories."listId" = lists.id
    INNER JOIN "usersLists" ON "usersLists"."listId" = lists.id
  WHERE "usersLists"."userId" = ${userId}
    AND lists.id = ${listId}
    AND items."categoryId" = categories.id
    AND items.id = ${itemId};
  `);
};

export const clearPickedUpItemsInShoppingList = async (
  userId: string,
  listId: number,
) => {
  await db.execute(sql`
  UPDATE items
  SET
    "isPickedUp" = false,
    "isInShoppingList" = false
  FROM
    categories
    INNER JOIN lists ON categories."listId" = lists.id
    INNER JOIN "usersLists" ON "usersLists"."listId" = lists.id
  WHERE
    items."isPickedUp" = true
    and "usersLists"."userId" = ${userId}
    and lists.id = ${listId}
    and items."categoryId" = categories.id;
  `);
};
