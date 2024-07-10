import { Button, Flex, Table, Typography } from "antd";
import { ColumnType, ColumnsType } from "antd/es/table";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDatabase, FaRegCircle, FaRegHand } from "react-icons/fa6";
import { useLoaderData } from "react-router-dom";
import {
  GetStateResponse,
  PushCommandRequest,
  StateRow,
} from "../../../models";
import { HttpService, isDark, scrollToTop } from "../../../utils";
import { CustomPage, CustomPager } from "./CustomPager";
import classNames from "classnames";

interface StateData {
  code: string;
  [key: string]: string;
}

const ViewState: React.FunctionComponent = () => {
  const response = useLoaderData() as GetStateResponse;
  const state = response.state!;

  const getPageId = (row: StateRow): string => {
    return `${row.codeStart} - ${row.codeEnd}`;
  };

  const { t } = useTranslation();
  const [page, setPage] = useState<CustomPage>({
    label: getPageId(state.rows[0]),
    value: getPageId(state.rows[0]),
  });
  const [pages] = useState<CustomPage[]>(
    state.rows.map((row) => {
      return {
        label: getPageId(row),
        value: getPageId(row),
      };
    })
  );
  const [dataSource, setDataSource] = useState<StateData[]>([]);

  const push = async (codes: string) => {
    const request: PushCommandRequest = {
      command: codes,
      stateID: state.id,
      successMessage: t("State*PushCommand*SuccessMessage"),
    };
    await HttpService.post("/api/state/pushcommand", request);
  };

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
            title: (
              <Button
                shape="round"
                className={classNames("state-view-header-button", {
                  dark: isDark(column.color),
                })}
                style={{
                  background: column.color ? `${column.color}` : "initial",
                }}
              >
                {column.caption}
              </Button>
            ),
            dataIndex: column.code,
            align: "center",

            // onHeaderCell: () => {
            //   return {
            //     onClick: () => {
            //       const arr = dataSource.map((d) => {
            //         return d[column.code];
            //       });
            //       const codes = arr.join("|");
            //       push(codes);
            //     },
            //   };
            // },
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

  useEffect(() => {
    const dataSource: StateData[] = [];
    const row = _.find(state.rows, (row) => {
      if (getPageId(row) === page.value) return true;
      return false;
    })!;

    const dataList = new Array(row.codeEnd - row.codeStart + 1)
      .fill(0)
      .map((_, index) => {
        const code = `${row.codeStart + index}`;
        const data = { code } as StateData;
        state.columns.forEach((column) => {
          data[`${column.code}`] = `${code}${column.code}`;
        });
        return data;
      });
    dataSource.push(...dataList);
    setDataSource(dataSource);
    scrollToTop();
  }, [page, state.columns, state.rows]);

  return (
    <Flex vertical gap={16}>
      <Table
        size="small"
        bordered={true}
        dataSource={dataSource}
        columns={columns}
        rowHoverable={false}
        pagination={false}
        rowKey={(row) => row.code}
        sticky={true}
        scroll={{ x: "max-content" }}
      ></Table>

      <CustomPager
        page={page}
        pages={pages}
        onPageSet={(page) => setPage(page)}
      />
    </Flex>
  );
};
export default ViewState;
