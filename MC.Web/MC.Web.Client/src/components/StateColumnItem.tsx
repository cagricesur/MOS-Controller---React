import { Card, Flex } from "antd";
import React from "react";
import { StateColumn } from "../models";

interface StateColumnItemProps {
  column: StateColumn;
}

export const StateColumnItem: React.FunctionComponent<StateColumnItemProps> = (
  props
) => {
  return (
    <Flex vertical={false}>
      <Card>
        <div className="state-column-caption">{props.column.caption}</div>
      </Card>
    </Flex>
  );
};
