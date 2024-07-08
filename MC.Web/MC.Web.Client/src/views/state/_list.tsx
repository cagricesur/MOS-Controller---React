import { App, Button, Card, Empty, Flex, List, Typography } from "antd";
import _ from "lodash";
import moment from "moment";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDiceD6, FaRegTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import {
  DeleteStateRequest,
  ListStatesRequest,
  ListStatesResponse,
  State,
  UserRoleEnum,
} from "../../models";
import { HttpService, useAppStore } from "../../utils";
import i18n from "../../utils/localizationService";

const StateList: React.FunctionComponent = () => {
  const nav = useNavigate();
  const appStore = useAppStore();
  const [states, setStates] = useState<State[]>([]);
  const { t } = useTranslation();
  const { modal } = App.useApp();

  useEffect(() => {
    const request: ListStatesRequest = {};
    HttpService.post<ListStatesResponse>("/api/state/list", request).then(
      (response) => {
        setStates(response.data.states);
      }
    );
  }, []);

  const getActions = (state: State): ReactNode[] | undefined => {
    const role: UserRoleEnum =
      UserRoleEnum[
        (appStore.profile?.user?.role || "Unknown") as keyof typeof UserRoleEnum
      ];
    if (role === UserRoleEnum.Administrator) {
      return [
        <Button
          size="large"
          shape="circle"
          icon={<FaRegTrashCan size={18} color="#8b0000" />}
          onClick={(event) => {
            event.stopPropagation();
            modal.confirm({
              content: t("StateList*Delete*Content"),
              okType: "danger",
              okText: t("StateList*Delete*OkButton"),
              cancelText: t("StateList*Delete*CancelButton"),

              onOk: async () => {
                const request: DeleteStateRequest = {
                  id: state.id,
                };
                await HttpService.post("api/state/delete", request);
                const _states = [...states];
                _.remove(_states, (s) => s.id === state.id);
                setStates(_states);
              },
            });
            return false;
          }}
        ></Button>,
      ];
    }
    return undefined;
  };

  const getDescription = (state: State): ReactNode => {
    const date = moment(state.creationDate);
    date.locale(i18n.language === "tr" ? "tr" : "en-gb");
    return (
      <Flex vertical gap={4}>
        {state.description && (
          <Typography.Text ellipsis>{state.description}</Typography.Text>
        )}
        <div>{`${date.format("DD MMM YYYY")} | ${state.codeStart} - ${
          state.codeEnd
        }`}</div>
      </Flex>
    );
  };

  return (
    <>
      {states.length === 0 ? (
        <Empty
          description={t("StateList*Empty")}
          style={{ marginTop: "10rem" }}
        ></Empty>
      ) : (
        <List
          className="state-list"
          rowKey={(state) => state.id}
          dataSource={states}
          renderItem={(state) => {
            return (
              <List.Item>
                <Card
                  className="state-list-item"
                  onClick={(event) => {
                    event.stopPropagation();
                    nav(`/state/${state.id}`);
                    return false;
                  }}
                  actions={getActions(state)}
                >
                  <Card.Meta
                    avatar={<FaDiceD6 size={36} />}
                    title={
                      <Typography.Title level={3} ellipsis>
                        {state.caption}
                      </Typography.Title>
                    }
                    description={getDescription(state)}
                  ></Card.Meta>
                </Card>
              </List.Item>
            );
          }}
        ></List>
      )}
    </>
  );
};

export default StateList;
