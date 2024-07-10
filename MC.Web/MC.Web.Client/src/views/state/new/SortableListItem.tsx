import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column } from "./ColumnList";
import { SortableItem } from "./SortableItem";

interface SortableListItemProps {
  column: Column;
  onRemove: () => void;
}

export const SortableListItem: React.FunctionComponent<
  SortableListItemProps
> = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableItem
      column={props.column}
      onRemove={props.onRemove}
      ref={setNodeRef}
      style={{ ...style }}
      {...attributes}
      {...listeners}
    ></SortableItem>
  );
};
