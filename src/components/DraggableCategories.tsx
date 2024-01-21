"use client";

import { Category, CategoryWithoutItems } from "@/types/List";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useState } from "react";

type Source = {
  droppableId: string;
  index: number;
};
type Destination = Source;
type Props = { listId: number; categories: CategoryWithoutItems[] };

export const DraggableCategories = ({ listId, categories }: Props) => {
  const [orderedCategories, setOrderedCategories] = useState(categories);
  console.log("orderedCategories:", orderedCategories);
  const handleDragEnd = (results: any) => {
    console.log("drag end, results:", results);
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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="categories">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-2 bg-slate-100"
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
                    className="bg-blue-100 py-3"
                  >
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
  );
};
