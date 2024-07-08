import {
  App,
  Button,
  Flex,
  Form,
  Input,
  Layout,
  Switch,
  Typography,
} from "antd";
import axios from "axios";
import classNames from "classnames";
import { GB, TR } from "country-flag-icons/react/3x2";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { AuthenticationRequest, AuthenticationResponse } from "../../models";
import { useAppStore } from "../../utils";

const LanguateTR = "tr";
const LanguateEN = "en";

const Login: React.FunctionComponent = () => {
  const { Header, Content, Footer } = Layout;
  const nav = useNavigate();
  const [form] = Form.useForm<AuthenticationRequest>();
  const { i18n } = useTranslation();
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const onFinish = async (request: AuthenticationRequest) => {
    useAppStore.setState({ isLoading: true });
    axios
      .post<AuthenticationResponse>("/api/user/authenticate", request)
      .then((response) => {
        if (response.data.error) {
          message.warning(t(response.data.error.code));
        } else {
          useAppStore.setState({
            profile: {
              user: response.data.user,
              token: response.data.token,
              tokenExpiration: response.data.tokenExpiration,
            },
          });
          nav("/");
        }
      })
      .catch(() => {
        message.warning(t("UNKNOWNERROR"));
      })
      .finally(() => {
        useAppStore.setState({ isLoading: false });
      });
  };

  return (
    <Layout className="mc-wrapper">
      <Header className="mc-header">
        <Typography.Title className="mc-app-title" level={2}>
          MOS Controller
        </Typography.Title>
      </Header>
      <Content className="mc-content mc-auth">
        <div>
          <Flex vertical={true}>
            <Form
              size="large"
              form={form}
              onFinish={onFinish}
              className="mc-auth-form"
              labelCol={{ span: 24 }}
            >
              <Form.Item
                // initialValue="Admin"
                name="userName"
                label={t("Login*UserName")}
                required={false}
                rules={[
                  {
                    required: true,
                    message: t("Login*UserNameRequeiredValidation"),
                  },
                ]}
              >
                <Input prefix={<FaUser />} placeholder={t("Login*UserName")} />
              </Form.Item>
              <Form.Item
                // initialValue="Admin1234*"
                name="password"
                label={t("Login*Password")}
                required={false}
                rules={[
                  {
                    required: true,
                    message: t("Login*PasswordRequiredValidation"),
                  },
                ]}
              >
                <Input.Password
                  prefix={<FaLock />}
                  placeholder={t("Login*Password")}
                  iconRender={(visible) =>
                    visible ? <FaEye /> : <FaEyeSlash />
                  }
                  visibilityToggle={{
                    visible: showPassword,
                    onVisibleChange: setShowPassword,
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" block htmlType="submit">
                  {t("Login*LoginButton")}
                </Button>
              </Form.Item>
            </Form>
            <Button
              type="link"
              onClick={() => {
                nav("/register");
              }}
            >
              {t("Login*RegisterButton")}
            </Button>
          </Flex>
        </div>
      </Content>
      <Footer className="mc-footer">
        <Flex vertical={false} gap={16} justify="center" align="center">
          <TR
            className={classNames("flag-language", {
              selected: i18n.language === LanguateTR,
            })}
          />
          {i18n.language === LanguateEN && (
            <Switch
              checkedChildren="EN"
              unCheckedChildren="TR"
              checked={i18n.language === LanguateEN}
              onChange={() => {
                changeLanguage(LanguateTR);
              }}
            />
          )}
          {i18n.language === LanguateTR && (
            <Switch
              className="mirror"
              checkedChildren="TR"
              unCheckedChildren="EN"
              checked={i18n.language === LanguateTR}
              onChange={() => {
                changeLanguage(LanguateEN);
              }}
            />
          )}
          <GB
            className={classNames("flag-language", {
              selected: i18n.language === LanguateEN,
            })}
          />
        </Flex>
      </Footer>
    </Layout>
  );
};

export default Login;
