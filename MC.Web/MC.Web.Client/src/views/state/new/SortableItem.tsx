import { Button, Flex, Typography } from "antd";
import classNames from "classnames";
import React, { HTMLAttributes } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { Column } from "./ColumnList";

interface SortableItem extends HTMLAttributes<HTMLDivElement> {
  column: Column;
  onRemove: () => void;
}
export const SortableItem = React.forwardRef<HTMLDivElement, SortableItem>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ column, className, onRemove, ...rest }, ref) => (
    <div ref={ref} className={classNames(className, "sortable-item")} {...rest}>
      <Flex gap={16}>
        <Button
          disabled
          block
          type="dashed"
          className={classNames("sortable-item-content", { dark: column.dark })}
          style={{
            background: column.color || "none",
          }}
        >
          <Typography.Text
            ellipsis
          >{`${column.caption} | ${column.code}`}</Typography.Text>
        </Button>
        <Button
          data-no-dnd="true"
          icon={<FaRegTrashCan size={18} color="#8b0000" />}
          onClick={onRemove}
        ></Button>
      </Flex>
    </div>
  )
);
