import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  MouseSensorOptions,
  TouchSensor,
  TouchSensorOptions,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button, ColorPicker, Flex, Form, Input } from "antd";
import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { v4 as uuidv4 } from "uuid";
import { StateColumn } from "../../../models";
import { isDark } from "../../../utils";
import { SortableListItem } from "./SortableListItem";

export interface Column extends StateColumn {
  dark: boolean;
}

interface ColumListProps {
  columns: Column[];
  onSet: (columns: Column[]) => void;
}

class SmartTouchSensor extends TouchSensor {
  static activators: {
    eventName: "onTouchStart";
    handler: (
      { nativeEvent }: React.TouchEvent<Element>,
      { onActivation }: TouchSensorOptions
    ) => boolean;
  }[] = [
    {
      eventName: "onTouchStart",
      handler: (event) => {
        let button: HTMLButtonElement | undefined = undefined;
        if (event.target instanceof SVGPathElement) {
          button = event.target.parentElement?.parentElement
            ?.parentElement as HTMLButtonElement;
        } else if (event.target instanceof SVGElement) {
          button = event.target.parentElement
            ?.parentElement as HTMLButtonElement;
        } else if (event.target instanceof HTMLSpanElement) {
          button = event.target.parentElement as HTMLButtonElement;
        } else if (event.target instanceof HTMLButtonElement) {
          button = event.target as HTMLButtonElement;
        }
        if (button && button.getAttribute("data-no-dnd") === "true") {
          return false;
        }
        return true;
      },
    },
  ];
}
class SmartMouseSensor extends MouseSensor {
  static activators: {
    eventName: "onMouseDown";
    handler: (
      { nativeEvent }: React.MouseEvent<Element, MouseEvent>,
      { onActivation }: MouseSensorOptions
    ) => boolean;
  }[] = [
    {
      eventName: "onMouseDown",
      handler: (event) => {
        let button: HTMLButtonElement | undefined = undefined;
        if (event.target instanceof SVGPathElement) {
          button = event.target.parentElement?.parentElement
            ?.parentElement as HTMLButtonElement;
        } else if (event.target instanceof SVGElement) {
          button = event.target.parentElement
            ?.parentElement as HTMLButtonElement;
        } else if (event.target instanceof HTMLSpanElement) {
          button = event.target.parentElement as HTMLButtonElement;
        } else if (event.target instanceof HTMLButtonElement) {
          button = event.target as HTMLButtonElement;
        }
        if (button && button.getAttribute("data-no-dnd") === "true") {
          return false;
        }
        return true;
      },
    },
  ];
}

export const ColumnList: React.FunctionComponent<ColumListProps> = (props) => {
  const [caption, setCaption] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [color, setColor] = useState<string>("#ffffff");
  const [columns, setColumns] = useState<Column[]>(props.columns);

  useEffect(() => {
    setColumns(props.columns);
  }, [props.columns]);

  const mouseSensor = useSensor(SmartMouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(SmartTouchSensor, {
    activationConstraint: {
      tolerance: 5,
      delay: 0,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over) {
      if (active.id !== over.id) {
        const oldIndex = columns.findIndex((column) => column.id === active.id);
        const newIndex = columns.findIndex((column) => column.id === over.id);
        const _columns = arrayMove(columns, oldIndex, newIndex);
        props.onSet(_columns);
        setColumns(_columns);
      }
    }
  };

  return (
    <>
      <Form.Item label={t("NewState*Columns")}>
        <Flex justify="center" align="center" gap={8}>
          <Input
            style={{ flex: "auto" }}
            value={caption}
            placeholder={t("NewState*Column*Caption")}
            onChange={(event) => {
              setCaption(event.target.value);
            }}
          ></Input>

          <Input
            style={{ flex: "auto" }}
            value={code}
            placeholder={t("NewState*Column*Code")}
            onChange={(event) => {
              setCode(event.target.value);
            }}
          ></Input>
          <ColorPicker
            disabledAlpha
            placement="top"
            presets={[
              {
                label: "",
                colors: ["#fff8dc", "#00ff00", "#0000ff", "#ff0000", "#c3c3c3"],
                defaultOpen: true,
              },
            ]}
            value={color}
            onChange={(_v, hex) => setColor(hex)}
          ></ColorPicker>
          <Flex gap={8}>
            <Button
              icon={<FaPlus size={18} color="#008b00" />}
              onClick={() => {
                if (caption && code) {
                  const _columns = [...columns];
                  _columns.push({
                    id: uuidv4(),
                    caption,
                    code,
                    position: 0,
                    color,
                    dark: isDark(color),
                  });
                  props.onSet(_columns);
                  setColumns(_columns);
                  setCaption("");
                  setCode("");
                }
              }}
            ></Button>
          </Flex>
        </Flex>
      </Form.Item>
      {columns.length > 0 && (
        <Form.Item>
          <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={columns}
              strategy={verticalListSortingStrategy}
            >
              {columns.map((column, index) => (
                <SortableListItem
                  key={column.id}
                  column={column}
                  onRemove={() => {
                    const _columns = [
                      ...columns.slice(0, index),
                      ...columns.slice(index + 1),
                    ];
                    props.onSet(_columns);
                    setColumns(_columns);
                  }}
                />
              ))}
            </SortableContext>
          </DndContext>
        </Form.Item>
      )}
    </>
  );
};
