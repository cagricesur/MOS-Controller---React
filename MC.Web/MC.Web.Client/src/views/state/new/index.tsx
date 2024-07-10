import { App, Button, Form, Input } from "antd";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaUser } from "react-icons/fa6";
import { useLoaderData, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  AddStateRequest,
  AddStateResponse,
  StateRowExtended,
  StateRowExtendedContainer,
} from "../../../models";
import { HttpService } from "../../../utils";
import { Column, ColumnList } from "./ColumnList";
import { RowList } from "./RowList";

const NewState: React.FunctionComponent = () => {
  const data = useLoaderData() as StateRowExtendedContainer;

  const nav = useNavigate();
  const [form] = Form.useForm<AddStateRequest>();
  const { t } = useTranslation();
  const [caption, setCaption] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [rows, setRows] = useState<StateRowExtended[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

  const { message } = App.useApp();

  const onFinish = async () => {
    if (columns.length === 0) {
      message.warning(t("NewState*MissingColumns"));
    } else if (_.every(rows, (row) => !row.enabled)) {
      message.warning(t("NewState*MissingRows"));
    } else {
      const request: AddStateRequest = {
        state: {
          id: uuidv4(),
          creationDate: new Date(),
          caption,
          description,
          rows: _.filter(rows, (row) => row.enabled),
          columns: columns.map((column, index) => {
            return {
              caption: column.caption,
              code: column.code,
              color: column.color,
              id: column.id,
              position: index + 1,
            };
          }),
        },
      };

      HttpService.post<AddStateResponse>("/api/state/add", request).then(() => {
        nav("/");
      });
    }
  };

  useEffect(() => {
    setRows(data.rows);
    setColumns([]);
    setCaption("");
    setDescription("");
    form.resetFields();
  }, [data, form]);

  useEffect(() => {
    setCaption("");
    setDescription("");
  }, []);

  return (
    <Form
      size="large"
      form={form}
      onFinish={onFinish}
      onFinishFailed={(error) => {
        const id = error.errorFields[0].name.toString();
        const element = document.getElementById(id);
        let parent: HTMLElement | null | undefined = element?.parentElement;
        while (parent) {
          if (parent.classList.contains("ant-form-item")) {
            break;
          }
          parent = parent.parentElement;
        }
        if (parent) {
          const main = document.getElementsByTagName("main")[0];
          const top =
            main.scrollTop -
            main.getBoundingClientRect().top +
            parent.getBoundingClientRect().top;

          main.scroll({
            behavior: "smooth",
            top,
          });
        }
      }}
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
      <ColumnList columns={columns} onSet={(columns) => setColumns(columns)} />
      <RowList rows={rows} onSet={(rows) => setRows(rows)} />

      <Form.Item>
        <Button type="primary" block htmlType="submit">
          {t("NewState*CreateButton")}
        </Button>
      </Form.Item>
    </Form>
  );
};
export default NewState;
