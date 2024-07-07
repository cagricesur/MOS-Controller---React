import { App, ConfigProvider, Spin } from "antd";
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./components";
import { theme } from "./theme";
import "./theme/theme.scss";
import {
  fetchStatedData,
  fetchUsers,
  fetchConfigs,
  useAppStore,
} from "./utils";

const Login = React.lazy(() => import("./views/login"));
const Register = React.lazy(() => import("./views/register"));
const State = React.lazy(() => import("./views/state"));
const Configs = React.lazy(() => import("./views/configs"));
const Users = React.lazy(() => import("./views/users"));
const Error = React.lazy(() => import("./views/error"));

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <Error />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <State />,
      },
      {
        path: "/state/:id?",
        element: <State />,
        loader: fetchStatedData,
      },
      {
        path: "/configs",
        element: <Configs />,
        loader: fetchConfigs,
      },
      {
        path: "/users",
        element: <Users />,
        loader: fetchUsers,
      },
    ],
  },
]);

const Loading: React.FunctionComponent<{ isLoading: boolean }> = (props) => {
  return (
    <Spin spinning={props.isLoading} fullscreen delay={100} size="large"></Spin>
  );
};

const Master: React.FunctionComponent = () => {
  const appStore = useAppStore();
  return (
    <React.Suspense>
      <ConfigProvider theme={theme}>
        <App
          message={{
            duration: 3,
            maxCount: 1,
            top: 64,
          }}
        >
          <Loading isLoading={appStore.isLoading}></Loading>
          <RouterProvider router={router} />
        </App>
      </ConfigProvider>
    </React.Suspense>
  );
};
export default Master;
