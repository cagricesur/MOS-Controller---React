import { Button, Drawer, Layout, Typography } from "antd";
import React, { useMemo, useRef, useState } from "react";
import * as Icons from "react-icons/fa6";
import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../utils";
import { Menu } from "./Menu";

export const ProtectedRoute: React.FunctionComponent = () => {
  const appStore = useAppStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const [openMenu, toggleMenu] = useState<boolean>(false);

  const { Header, Content, Footer } = Layout;

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
                  destroyOnClose
                  onClose={() => toggleMenu(false)}
                  closeIcon={false}
                  mask={false}
                  maskClosable={false}
                  getContainer={() => contentRef.current!}
                  placement="bottom"
                  className="mc-menu"
                  height="100%"
                >
                  <Menu onMenuClick={() => toggleMenu(false)} />
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
