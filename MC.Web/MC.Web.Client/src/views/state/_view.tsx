import { Button, Flex, Table, Typography } from "antd";
import { ColumnType, ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";
import { FaDatabase, FaRegCircle, FaRegHand } from "react-icons/fa6";
import { useLoaderData } from "react-router-dom";
import { GetStateResponse, PushCommandRequest } from "../../models";
import { HttpService } from "../../utils";

interface StateData {
  code: string;
  [key: string]: string;
}

const ViewState: React.FunctionComponent = () => {
  const response = useLoaderData() as GetStateResponse;
  const state = response.state!;
  const { t } = useTranslation();

  const push = async (codes: string) => {
    const request: PushCommandRequest = {
      command: codes,
      stateID: state.id,
      successMessage: t("State*PushCommand*SuccessMessage"),
    };
    await HttpService.post("/api/state/pushcommand", request);
  };

  const dataSource: StateData[] = new Array(state.codeEnd - state.codeStart + 1)
    .fill(0)
    .map((_, index) => {
      const code = `${state.codeStart + index}`;
      const data = { code } as StateData;
      state.columns.forEach((column) => {
        data[`${column.code}`] = `${code}${column.code}`;
      });
      return data;
    });
  const columns: ColumnsType<StateData> = [
    {
      title: (
        <Flex vertical={false} justify="space-between" align="center">
          <Button
            shape="circle"
            icon={<FaDatabase />}
            style={{ width: 48, height: 48 }}
            onClick={() => push("9902")}
          ></Button>
          <Typography.Title level={3} style={{ marginBlock: 0 }}>
            {state.caption}
          </Typography.Title>
          <Button
            shape="circle"
            icon={<FaRegCircle />}
            style={{ width: 48, height: 48 }}
            onClick={() => push("9901")}
          ></Button>
        </Flex>
      ),
      children: [
        {
          title: "",
          dataIndex: "code",
          fixed: true,
        },
        ...state.columns.map((column) => {
          return {
            title: <Button shape="round">{column.caption}</Button>,
            dataIndex: column.code,
            align: "center",

            onHeaderCell: () => {
              return {
                onClick: () => {
                  const arr = dataSource.map((d) => {
                    return d[column.code];
                  });
                  const codes = arr.join("|");
                  push(codes);
                },
              };
            },
            render: (value) => {
              return (
                <Button
                  shape="circle"
                  icon={<FaRegHand />}
                  onClick={() => push(value as string)}
                />
              );
            },
          } as ColumnType<StateData>;
        }),
      ],
    },
  ];

  return (
    <Table
      size="small"
      bordered={true}
      dataSource={dataSource}
      columns={columns}
      rowHoverable={false}
      pagination={{
        pageSize: 20,
        size: "small",
        hideOnSinglePage: true,
        position: ["bottomCenter"],
        showSizeChanger: false,
        showTitle: false,
      }}
      rowKey={(row) => row.code}
      sticky={true}
      scroll={{ x: "max-content" }}
    ></Table>
  );
};
export default ViewState;
