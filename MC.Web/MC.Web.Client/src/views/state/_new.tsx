import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  App,
  Button,
  Col,
  Drawer,
  Flex,
  Form,
  Input,
  Row,
  Slider,
  Typography,
} from "antd";
import classNames from "classnames";
import _ from "lodash";
import React, { HTMLAttributes, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaRegTrashCan, FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { AddStateRequest, AddStateResponse, StateColumn } from "../../models";
import { HttpService } from "../../utils";

interface SortableItem extends HTMLAttributes<HTMLDivElement> {
  column: StateColumn;
}

const SortableItem = React.forwardRef<HTMLDivElement, SortableItem>(
  ({ column, className, ...rest }, ref) => (
    <div ref={ref} className={classNames(className, "sortable-item")} {...rest}>
      <Button disabled block type="dashed" className="sortable-item-content">
        <Typography.Text
          ellipsis
        >{`${column.caption} | ${column.code}`}</Typography.Text>
      </Button>
    </div>
  )
);

interface SortableListItemProps {
  column: StateColumn;
}
const SortableListItem: React.FunctionComponent<SortableListItemProps> = (
  props
) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableItem
      column={props.column}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    ></SortableItem>
  );
};

const NewState: React.FunctionComponent = () => {
  const nav = useNavigate();
  const [form] = Form.useForm<AddStateRequest>();
  const { t } = useTranslation();
  const [caption, setCaption] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [codeStart, setCodeStart] = useState<number>(100);
  const [codeEnd, setCodeEnd] = useState<number>(199);
  const [columns, setColumns] = useState<StateColumn[]>([]);
  const [columnCaption, setColumnCaption] = useState<string>();
  const [columnCode, setColumnCode] = useState<string>();
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 0,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);
  const { message } = App.useApp();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over) {
      if (active.id !== over.id) {
        setColumns((columns) => {
          const oldIndex = columns.findIndex(
            (column) => column.id === active.id
          );
          const newIndex = columns.findIndex((column) => column.id === over.id);
          if (oldIndex > -1 && newIndex > -1) {
            return arrayMove(columns, oldIndex, newIndex);
          } else {
            return columns;
          }
        });
      }
    }
  };

  const onFinish = async () => {
    if (columns.length > 0) {
      const request: AddStateRequest = {
        state: {
          id: uuidv4(),
          creationDate: new Date(),
          caption,
          description,
          codeStart,
          codeEnd,
          columns: columns.map((column, index) => {
            return {
              caption: column.caption,
              code: column.code,
              id: column.id,
              position: index + 1,
            };
          }),
        },
      };

      HttpService.post<AddStateResponse>("/api/state/add", request).then(() => {
        nav("/");
      });
    } else {
      message.warning(t("NewState*MissingColumns"));
    }
  };

  return (
    <>
      <Drawer
        title={t("NewState*Remove*Column")}
        placement="bottom"
        closeIcon={null}
        footer={
          <Button block type="link" onClick={() => setDrawerOpen(false)}>
            {t("NewState*Remove*CancelButton")}
          </Button>
        }
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Flex vertical gap={16}>
          {columns.map((column) => {
            return (
              <Button
                block
                type="dashed"
                danger
                className="sortable-item-content"
                onClick={() => {
                  const index = columns.findIndex((c) => c.id === column.id);
                  if (index > -1) {
                    _.remove(columns, (c) => c.id === column.id);
                    setColumns(columns);
                  }
                  setDrawerOpen(false);
                }}
              >
                <Typography.Text
                  ellipsis
                >{`${column.caption} | ${column.code}`}</Typography.Text>
              </Button>
            );
          })}
        </Flex>
      </Drawer>
      <Form
        size="large"
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 24 }}
      >
        <Form.Item
          name="caption"
          label={t("NewState*Caption")}
          required={false}
          rules={[
            {
              required: true,
              message: t("NewState*StateCaptionRequeiredValidation"),
            },
            {
              min: 5,
              message: t("NewState*StateCaptionMinLengthValidation"),
            },
            {
              max: 50,
              message: t("NewState*StateCaptionMaxLengthValidation"),
            },
          ]}
        >
          <Input
            prefix={<FaUser />}
            value={caption}
            onChange={(event) => {
              setCaption(event.target.value);
            }}
            placeholder={t("NewState*Caption")}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={t("NewState*Description")}
          required={false}
          rules={[
            {
              max: 50,
              message: t("NewState*StateDescriptionMaxLengthValidation"),
            },
          ]}
        >
          <Input
            prefix={<FaUser />}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
            placeholder={t("NewState*Description")}
          />
        </Form.Item>
        <Form.Item
          label={`${t("NewState*CodeRange")} (${codeStart} - ${codeEnd})`}
          required={false}
          className="fi-control-mt-30"
        >
          <Slider
            min={100}
            max={999}
            value={[codeStart, codeEnd]}
            range={true}
            tooltip={{
              placement: "top",
              autoAdjustOverflow: false,
            }}
            onChange={(value) => {
              const min = value[0];
              const max = value[1];
              if (min < max) {
                setCodeStart(min);
                setCodeEnd(max);
              } else {
                setCodeStart(max);
                setCodeEnd(min);
              }
            }}
          ></Slider>
        </Form.Item>
        <Form.Item label={t("NewState*Columns")}>
          <Row justify="center" align="middle" gutter={8}>
            <Col span={9}>
              <Input
                value={columnCaption}
                placeholder={t("NewState*Column*Caption")}
                onChange={(event) => {
                  setColumnCaption(event.target.value);
                }}
              ></Input>
            </Col>
            <Col span={9}>
              <Input
                value={columnCode}
                placeholder={t("NewState*Column*Code")}
                onChange={(event) => {
                  setColumnCode(event.target.value);
                }}
              ></Input>
            </Col>
            <Col span={3}>
              <Button
                icon={<FaPlus size={18} color="#008b00" />}
                onClick={() => {
                  if (columnCaption && columnCode) {
                    setColumns([
                      ...columns,
                      {
                        id: uuidv4(),
                        caption: columnCaption,
                        code: columnCode,
                        position: 0,
                      },
                    ]);
                    setColumnCaption("");
                    setColumnCode("");
                  }
                }}
              ></Button>
            </Col>
            <Col span={3}>
              <Button
                disabled={columns.length === 0}
                onClick={() => {
                  setDrawerOpen(true);
                }}
                icon={
                  <FaRegTrashCan
                    size={18}
                    color={columns.length === 0 ? "#000000" : "#8b0000"}
                  />
                }
                className="sortab-item-remove"
              ></Button>
            </Col>
          </Row>
        </Form.Item>
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
              {columns.map((column) => (
                <SortableListItem key={column.id} column={column} />
              ))}
            </SortableContext>
          </DndContext>
        </Form.Item>

        <Form.Item>
          <Button type="primary" block htmlType="submit">
            {t("NewState*CreateButton")}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default NewState;
