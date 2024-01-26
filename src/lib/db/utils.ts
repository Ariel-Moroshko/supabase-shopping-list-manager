import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from ".";
import { sql } from "drizzle-orm";
import { categories, items, lists, users, usersLists } from "./schema";
import { Language } from "../dictionaries";

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

export const getUserMainList = async (userId: string) => {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {},
    with: {
      mainList: true,
    },
  });
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

  const newCategory = (
    await db
      .insert(categories)
      .values({
        listId,
        name: categoryName,
        position: lastCategoryPosition + 1,
      })
      .returning()
  )[0];
  return newCategory;
};

export const createItemInCategory = async (
  categoryId: number,
  itemName: string,
) => {
  return (
    await db.insert(items).values({ name: itemName, categoryId }).returning()
  )[0];
};

export const addItemToShoppingList = async (userId: string, itemId: number) => {
  await db.execute(sql`
  UPDATE items
  SET 
    "isInShoppingList" = true
  FROM 
    categories
    INNER JOIN "usersLists" ON "usersLists"."listId" = categories."listId"
  WHERE "usersLists"."userId" = ${userId}
    AND items."categoryId" = categories.id
    AND items.id = ${itemId}
  `);
};

export const pickUpItemInShoppingList = async (
  userId: string,
  itemId: number,
  pickUpTime: string,
) => {
  await db.execute(sql`
  UPDATE items
  SET 
    "isPickedUp" = true,
    "pickedUpAt" = ${pickUpTime}
  FROM 
    categories
    INNER JOIN "usersLists" ON "usersLists"."listId" = categories."listId"
  WHERE "usersLists"."userId" = ${userId}
    AND items."categoryId" = categories.id
    AND items.id = ${itemId}
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
    "isInShoppingList" = false,
    "pickedUpAt" = NULL
  FROM
    categories
    INNER JOIN "usersLists" ON "usersLists"."listId" = categories."listId"
  WHERE
    items."isPickedUp" = true
    and "usersLists"."userId" = ${userId}
    and "usersLists"."listId" = ${listId}
    and items."categoryId" = categories.id;
  `);
};

export const undoPickedUpItemInShoppingList = async (
  userId: string,
  itemId: number,
) => {
  await db.execute(sql`
  UPDATE items
  SET 
    "isPickedUp" = false,
    "pickedUpAt" = null
  FROM 
    categories
    INNER JOIN "usersLists" ON "usersLists"."listId" = categories."listId"
  WHERE "usersLists"."userId" = ${userId}
    AND items."categoryId" = categories.id
    AND items.id = ${itemId}
  `);
};

export const areAllCategoriesInUsersList = async (
  userId: string,
  listId: number,
  categoriesIds: number[],
) => {
  const result = await db
    .select({ id: categories.id })
    .from(categories)
    .innerJoin(usersLists, eq(usersLists.listId, categories.listId))
    .where(
      and(
        inArray(categories.id, categoriesIds),
        and(eq(usersLists.listId, listId), eq(usersLists.userId, userId)),
      ),
    );
  return result.length === categoriesIds.length;
};

export const reorderCategoriesInList = async (
  listId: number,
  categoriesIds: number[],
) => {
  const values = categoriesIds
    .map((id, index) => `(${id}, ${index + 1})`)
    .join(",");
  await db.execute(sql`
    UPDATE categories
    SET
      position = new_positions.position
    FROM
      (
        values ${sql.raw(values)}
      ) as new_positions (id, position)
    WHERE
      categories.id = new_positions.id
      and categories."listId" = ${listId};
    `);
};

export const getListByIdAndInvitationKey = async (
  id: number,
  invitationKey: string,
) => {
  try {
    return (
      await db
        .select({ id: lists.id })
        .from(lists)
        .where(and(eq(lists.id, id), eq(lists.invitationKey, invitationKey)))
    )[0];
  } catch (error) {
    return null;
  }
};

export const hasUserListId = async (userId: string, listId: number) => {
  return (
    await db
      .select()
      .from(usersLists)
      .where(and(eq(usersLists.userId, userId), eq(usersLists.listId, listId)))
  )[0];
};

export const joinUserToList = async (userId: string, listId: number) => {
  await db.transaction(async (tx) => {
    await tx.insert(usersLists).values({ listId, userId });

    // update mainListId if this is the user's first list
    await tx
      .update(users)
      .set({ mainListId: listId })
      .where(and(eq(users.id, userId), isNull(users.mainListId)));
  });
};

export const editItemNote = async (
  userId: string,
  itemId: number,
  note: string,
) => {
  await db.execute(sql`
  UPDATE items
  SET 
    note = ${note}
  FROM 
    categories
    INNER JOIN "usersLists" ON "usersLists"."listId" = categories."listId"
  WHERE "usersLists"."userId" = ${userId}
    AND items."categoryId" = categories.id
    AND items.id = ${itemId}
  `);
};

export const deleteItem = async (userId: string, itemId: number) => {
  await db.execute(sql`
  DELETE FROM 
    items USING categories
    INNER JOIN "usersLists" ON "usersLists"."listId" = categories."listId"
  WHERE 
    "usersLists"."userId" = ${userId}
    AND items."categoryId" = categories.id
    AND items.id = ${itemId}
  `);
};

export const isUserAllowedToEditCategory = async (
  userId: string,
  categoryId: number,
) => {
  return (
    await db.execute(sql`
    SELECT 1 
    FROM categories 
    INNER JOIN "usersLists" ON "usersLists"."listId" = categories."listId"
    WHERE "usersLists"."userId" = ${userId}
      AND categories.id = ${categoryId}
  `)
  )[0];
};

export const isCategoryNameExistsInList = async (
  categoryId: number,
  categoryName: string,
) => {
  const { listId } = (
    await db
      .select({ listId: categories.listId })
      .from(categories)
      .where(eq(categories.id, categoryId))
  )[0];
  const exists = await db
    .select()
    .from(categories)
    .where(
      and(eq(categories.name, categoryName), eq(categories.listId, listId)),
    );
  return exists.length > 0;
};

export const updateCategoryName = async (
  userId: string,
  categoryId: number,
  categoryName: string,
) => {
  await db.execute(sql`
    UPDATE categories
    SET 
      name = ${categoryName}
    FROM "usersLists"
    WHERE "usersLists"."userId" = ${userId}
      AND categories."listId" = "usersLists"."listId"
      AND categories.id = ${categoryId}
  `);
};

export const changeListLanguage = async (
  userId: string,
  listId: number,
  language: Language,
) => {
  await db.execute(sql`
    UPDATE lists
    SET 
      language = ${language}
    FROM 
      "usersLists"
    WHERE lists."id" = ${listId}
      AND "usersLists"."userId" = ${userId}
      AND "usersLists"."listId" = ${listId}
  `);
};

export const deleteCategoryFromList = async (
  userId: string,
  categoryId: number,
) => {
  await db.execute(sql`
  DELETE FROM 
    categories USING "usersLists"
  WHERE 
    "usersLists"."userId" = ${userId}
    AND "usersLists"."listId" = categories."listId"
    AND categories.id = ${categoryId}
  `);
};

export const isUserAllowedToEditItem = async (
  userId: string,
  itemId: number,
) => {
  return (
    await db.execute(sql`
    SELECT 1 
    FROM items 
    INNER JOIN categories ON items."categoryId" = categories.id
    INNER JOIN "usersLists" ON "usersLists"."listId" = categories."listId"
    WHERE "usersLists"."userId" = ${userId}
      AND items."categoryId" = categories.id
      AND items.id = ${itemId}
  `)
  )[0];
};

export const isItemNameExistsInList = async (
  itemId: number,
  itemName: string,
) => {
  const { listId } = (
    await db
      .select({ listId: categories.listId })
      .from(items)
      .innerJoin(categories, eq(items.categoryId, categories.id))
      .where(eq(items.id, itemId))
  )[0];
  const exists = await db
    .select()
    .from(items)
    .innerJoin(categories, eq(items.categoryId, categories.id))
    .where(and(eq(items.name, itemName), eq(categories.listId, listId)));
  return exists.length > 0;
};

export const updateItemName = async (
  itemId: number,
  updatedItemName: string,
) => {
  await db
    .update(items)
    .set({ name: updatedItemName })
    .where(eq(items.id, itemId));
};
