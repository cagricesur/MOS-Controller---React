import { Flex, Form, InputNumber, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StateRowExtended } from "../../../models";

interface RowProps extends StateRowExtended {
  label?: string;
  onSet: (code: number, active: boolean) => void;
}

interface RowListProps {
  rows: StateRowExtended[];
  onSet: (rows: StateRowExtended[]) => void;
}

const Row: React.FunctionComponent<RowProps> = (props) => {
  const [enabled, setEnabled] = useState<boolean>(props.enabled);
  const [end, setEnd] = useState<number | null>(props.codeEnd);

  useEffect(() => {
    setEnabled(props.enabled);
    setEnd(props.codeEnd);
  }, [props]);

  return (
    <Form.Item
      label={props.label}
      getValueFromEvent={() => {
        return end;
      }}
      rules={[
        {
          required: true,
          message: "required",
        },
        {
          min: props.codeStart,
          message: "min " + props.codeStart,
        },
        {
          max: props.max,
          message: "max " + props.max,
        },
      ]}
    >
      <Flex vertical={false} gap={16} align="center">
        <Switch
          checked={enabled}
          onChange={(checked) => {
            props.onSet(end || props.max, checked);
            setEnabled(checked);
          }}
        ></Switch>
        <InputNumber
          readOnly
          disabled={!enabled}
          value={props.codeStart}
          style={{ flex: "auto" }}
        ></InputNumber>
        <div>-</div>
        <InputNumber
          changeOnWheel
          controls={false}
          disabled={!enabled}
          value={end || props.max}
          min={props.codeStart}
          max={props.max}
          onChange={(value) => {
            const code = value || props.max;
            props.onSet(code, enabled);
            setEnd(code);
          }}
          style={{ flex: "auto" }}
        ></InputNumber>
      </Flex>
    </Form.Item>
  );
};

export const RowList: React.FunctionComponent<RowListProps> = (props) => {
  const [rows, setRows] = useState<StateRowExtended[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    setRows(props.rows);
  }, [props.rows]);
  return (
    <>
      {rows.map((row, index) => (
        <Row
          key={index}
          label={index === 0 ? t("NewState*CodeRange") : undefined}
          {...row}
          onSet={(code, enabled) => {
            const _rows = [
              ...rows.slice(0, index),
              {
                id: row.id,
                codeStart: row.codeStart,
                codeEnd: code,
                max: row.max,
                enabled: enabled,
              } as StateRowExtended,
              ...rows.slice(index + 1),
            ];
            props.onSet(_rows);
            setRows(_rows);
          }}
        />
      ))}
    </>
  );
};
