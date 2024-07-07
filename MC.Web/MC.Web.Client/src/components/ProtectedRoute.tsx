import { Button, Drawer, Layout, List, Typography } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IconType } from "react-icons";
import * as Icons from "react-icons/fa6";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { GetMenusResponse } from "../models";
import { HttpService, useAppStore } from "../utils";

interface IMenu {
  caption: string;
  action: () => void;
  icon: IconType;
}

export const ProtectedRoute: React.FunctionComponent = () => {
  const appStore = useAppStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const [openMenu, toggleMenu] = useState<boolean>(false);
  const [menu, setMenu] = useState<IMenu[]>([]);
  const nav = useNavigate();

  const { t } = useTranslation();
  const { Header, Content, Footer } = Layout;

  const getIcon = (name: string) => {
    const icons = Object.entries(Icons);
    const icon = icons.find((item) => {
      return item[0] === name;
    });
    const FaIcon = icon && icon[1] ? icon[1] : Icons.FaTerminal;
    return FaIcon;
  };

  const isProtected = useMemo(() => {
    if (
      appStore.profile &&
      appStore.profile.user &&
      appStore.profile.token &&
      appStore.profile.tokenExpiration
    ) {
      const date = new Date(appStore.profile.tokenExpiration);
      return date > new Date();
    }
    return false;
  }, [appStore.profile]);

  useEffect(() => {
    if (isProtected) {
      HttpService.get<GetMenusResponse>("/api/app/getmenus").then(
        (response) => {
          const menu = response.data.menus.map((menu) => {
            return {
              caption: t(`Menu*${menu.caption}`),
              action: () => {
                nav(`${menu.path}`);
              },
              icon: getIcon(menu.icon),
            };
          });
          menu.push({
            caption: t("Menu*Logout"),
            action: () => {
              useAppStore.setState({
                profile: undefined,
              });
            },
            icon: getIcon("FaPowerOff"),
          });
          setMenu(menu);
        }
      );
    }
  }, [isProtected, nav, t]);

  return (
    <>
      {isProtected ? (
        <>
          <Layout className="mc-wrapper">
            <Header className="mc-header">
              <Typography.Title className="mc-app-title" level={2}>
                MOS Controller
              </Typography.Title>
            </Header>
            <Content className="mc-content">
              <div ref={contentRef}>
                <Drawer
                  open={openMenu}
                  onClose={() => toggleMenu(false)}
                  closeIcon={false}
                  mask={false}
                  maskClosable={false}
                  getContainer={() => contentRef.current!}
                  placement="bottom"
                  className="mc-menu"
                  height="100%"
                >
                  <List
                    dataSource={menu}
                    renderItem={(menu) => {
                      return (
                        <List.Item
                          onClick={() => {
                            toggleMenu(false);
                            menu.action();
                          }}
                        >
                          <List.Item.Meta
                            avatar={<menu.icon size={24} />}
                            title={menu.caption}
                          />
                        </List.Item>
                      );
                    }}
                  ></List>
                </Drawer>
                <Outlet />
              </div>
            </Content>
            <Footer className="mc-footer">
              <Button
                shape="circle"
                style={{
                  width: 48,
                  height: 48,
                  margin: "0 auto",
                  border: "none",
                }}
                icon={
                  openMenu ? (
                    <Icons.FaEllipsisVertical size={48} />
                  ) : (
                    <Icons.FaEllipsis size={48} />
                  )
                }
                onClick={() => {
                  toggleMenu(!openMenu);
                }}
              ></Button>
            </Footer>
          </Layout>
        </>
      ) : (
        <Navigate to="/login" replace />
      )}
    </>
  );
};
