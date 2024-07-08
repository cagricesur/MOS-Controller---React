import {
  Badge,
  Button,
  Card,
  Drawer,
  Empty,
  Flex,
  List,
  Switch,
  Typography,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaUserCircle } from "react-icons/fa";
import { FaCheck, FaPen, FaUser, FaX } from "react-icons/fa6";
import { useLoaderData } from "react-router-dom";
import {
  ListUsersResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  User,
  UserStatusEnum,
} from "../../models";
import { HttpService } from "../../utils";

interface UserStatusSwitchProps {
  user: User;
  onChange: (status: UserStatusEnum) => void;
}

interface UserDetailProps {
  user: User;
  onOk: (user: User) => void;
  onCancel: () => void;
}

const getStatus = (status?: UserStatusEnum): UserStatusEnum => {
  if (typeof status === "number") {
    return status;
  }
  return UserStatusEnum[(status || "Passive") as keyof typeof UserStatusEnum];
};

const UserDetail: React.FunctionComponent<UserDetailProps> = (props) => {
  const [user, setUser] = useState<User>(props.user);
  return (
    <Flex vertical justify="center" align="center" gap={16}>
      <FaUserCircle size={48}></FaUserCircle>
      <Typography.Text ellipsis>{user.firstName}</Typography.Text>
      <Typography.Text ellipsis>{user.lastName}</Typography.Text>
      <UserStatusSwitch
        user={user}
        onChange={(_status) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { status, ...rest } = user;
          setUser({ status: _status, ...rest });
        }}
      ></UserStatusSwitch>
      <Flex gap={16} style={{ width: "100%", marginTop: "30px" }}>
        <Button
          block
          icon={<FaX color="#8b0000" />}
          onClick={() => {
            props.onCancel();
          }}
        ></Button>

        <Button
          block
          icon={<FaCheck color="#008b00" />}
          onClick={() => {
            props.onOk(user);
          }}
        ></Button>
      </Flex>
    </Flex>
  );
};

const UserStatusSwitch: React.FunctionComponent<UserStatusSwitchProps> = (
  props
) => {
  const [status, setStatus] = useState<UserStatusEnum>(
    getStatus(props.user?.status)
  );
  const { t } = useTranslation();
  return (
    <Switch
      checked={status === UserStatusEnum.Active}
      checkedChildren={t("UserStatusEnum*ActiveLabel")}
      unCheckedChildren={t("UserStatusEnum*PassiveLabel")}
      onChange={(checked) => {
        const _status = checked
          ? UserStatusEnum.Active
          : UserStatusEnum.Passive;
        setStatus(_status);
        props.onChange(_status);
      }}
    ></Switch>
  );
};

const Users: React.FunctionComponent = () => {
  const response = useLoaderData() as ListUsersResponse;
  const [user, setUser] = useState<User | undefined>(undefined);
  const [users, setUsers] = useState<User[]>(response.users);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);

  const { t } = useTranslation();

  return (
    <>
      <Drawer
        destroyOnClose
        closable={false}
        placement="bottom"
        open={isDrawerOpen}
        onClose={() => {
          setUser(undefined);
          setDrawerOpen(false);
        }}
      >
        {user && (
          <UserDetail
            user={user}
            onCancel={() => {
              setDrawerOpen(false);
            }}
            onOk={async (_user) => {
              const index = users.findIndex((u) => u.id === _user.id);
              if (index > -1) {
                const request: UpdateUserRequest = {
                  id: _user.id,
                  status: _user.status,
                };
                await HttpService.post<UpdateUserResponse>(
                  "/api/user/update",
                  request
                );
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { status, ...rest } = user;
                setUsers([
                  ...[...users].splice(0, index),
                  { status: _user.status, ...rest },
                  ...[...users].splice(index + 1),
                ]);
              }
              setDrawerOpen(false);
            }}
          ></UserDetail>
        )}
      </Drawer>
      {users.length === 0 ? (
        <Empty
          description={t("Users*Empty")}
          style={{ marginTop: "10rem" }}
        ></Empty>
      ) : (
        <List
          className="user-list"
          rowKey={(user) => user.id}
          dataSource={users}
          renderItem={(user) => {
            return (
              <List.Item>
                <Badge.Ribbon
                  text={
                    getStatus(user.status) === UserStatusEnum.Active
                      ? t("UserStatusEnum*ActiveLabel")
                      : t("UserStatusEnum*PassiveLabel")
                  }
                  color={
                    getStatus(user.status) === UserStatusEnum.Active
                      ? "#008b00"
                      : "#8b0000"
                  }
                >
                  <Card
                    className="user-list-item"
                    onClick={(event) => {
                      event.stopPropagation();
                      setUser(user);
                      setDrawerOpen(true);
                      return false;
                    }}
                    actions={[
                      <Button
                        size="large"
                        shape="circle"
                        icon={<FaPen size={18} color="#00008b" />}
                      ></Button>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<FaUser size={36} />}
                      title={
                        <Typography.Title level={3} ellipsis>
                          {user.userName}
                        </Typography.Title>
                      }
                      description={
                        <Typography.Text
                          ellipsis
                        >{`${user.firstName} ${user.lastName}`}</Typography.Text>
                      }
                    ></Card.Meta>
                  </Card>
                </Badge.Ribbon>
              </List.Item>
            );
          }}
        ></List>
      )}
    </>
  );
};
export default Users;
