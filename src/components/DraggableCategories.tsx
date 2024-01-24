"use client";

import { Category, CategoryWithoutItems } from "@/types/List";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { GripVertical, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useReorderCategories } from "@/hooks/useReorderCategories";

type Source = {
  droppableId: string;
  index: number;
};
type Destination = Source;
type Props = {
  listId: number;
  categories: CategoryWithoutItems[];
  setIsChangingOrder: (b: boolean) => void;
};

export const DraggableCategories = ({
  listId,
  categories,
  setIsChangingOrder,
}: Props) => {
  const [orderedCategories, setOrderedCategories] = useState(categories);
  const handleDragEnd = (results: any) => {
    const source: Source = results.source;
    const destination: Destination = results.destination;
    if (!destination || source.index === destination.index) {
      return;
    }
    const updatedOrder = orderedCategories.map((category) => ({ ...category }));
    const [sourceItem] = updatedOrder.splice(source.index, 1);
    updatedOrder.splice(destination.index, 0, sourceItem);
    setOrderedCategories(updatedOrder);
  };

  const queryClient = useQueryClient();
  const reorderCategoriesMutation = useReorderCategories();
  const [error, setError] = useState("");
  const pending = reorderCategoriesMutation.isPending;

  const handleChangeOrder = () => {
    setError("");
    const categoriesIds = orderedCategories.map((category) => category.id);
    reorderCategoriesMutation.mutate(
      { listId, categoriesIds },
      {
        onSuccess: () => {
          queryClient.setQueryData([listId, "categories"], () => {
            return orderedCategories.map((category) => ({ ...category }));
          });
          setIsChangingOrder(false);
        },
        onError: (error) => {
          setError(error.message);
        },
      },
    );
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Button
          className="flex min-w-36 items-center justify-center gap-2 font-bold"
          onClick={() => handleChangeOrder()}
          disabled={pending}
        >
          {pending ? (
            <>
              <Loader2 className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            "Save order"
          )}
        </Button>
        <Button variant="link" onClick={() => setIsChangingOrder(false)}>
          Cancel
        </Button>
      </div>
      {error && <div className="font-bold text-red-600">{error}</div>}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categories">
          {(provided) => (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-2 divide-y"
            >
              {orderedCategories.map((category, index) => (
                <Draggable
                  key={category.id}
                  draggableId={String(category.id)}
                  index={index}
                >
                  {(provided) => (
                    <li
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className="flex items-center gap-2 py-3"
                    >
                      <GripVertical />
                      {category.name}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ol>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
