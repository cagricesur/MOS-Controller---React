import { App, Button, Flex, Form, Input, Layout, Typography } from "antd";
import axios from "axios";
import parse from "html-react-parser";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash, FaLock, FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { AddUserRequest, AddUserResponse } from "../../models";
import { useAppStore } from "../../utils";

const Register: React.FunctionComponent = () => {
  const { Header, Content, Footer } = Layout;
  const nav = useNavigate();
  const [form] = Form.useForm<AddUserRequest>();
  const { message, modal } = App.useApp();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onFinish = async (request: AddUserRequest) => {
    useAppStore.setState({ isLoading: true });
    axios
      .post<AddUserResponse>("/api/user/add", request)
      .then((response) => {
        if (response.data.error) {
          message.warning(t(response.data.error.code));
        } else {
          modal.success({
            centered: true,
            closable: false,
            maskClosable: false,
            destroyOnClose: true,
            okButtonProps: {},
            content: t("Register*SuccessMessage"),
            okText: t("Register*SuccessOKButton"),
            onOk: () => {
              nav("/login");
            },
          });
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
          <Form
            size="large"
            form={form}
            onFinish={onFinish}
            onFinishFailed={(error) => {
              const id = error.errorFields[0].name.toString();
              const element = document.getElementById(id);
              let parent: HTMLElement | null | undefined =
                element?.parentElement;
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
            className="mc-auth-form"
            labelCol={{ span: 24 }}
          >
            <Form.Item
              name="userName"
              label={t("Register*UserName")}
              required={false}
              rules={[
                {
                  required: true,
                  message: t("Register*UserNameRequeiredValidation"),
                },
                {
                  min: 5,
                  message: t("Register*UserNameMinLengthValidation"),
                },
                {
                  max: 10,
                  message: t("Register*UserNameMaxLengthValidation"),
                },
              ]}
            >
              <Input prefix={<FaUser />} placeholder={t("Register*UserName")} />
            </Form.Item>
            <Form.Item
              name="firstName"
              label={t("Register*FirstName")}
              required={false}
              rules={[
                {
                  required: true,
                  message: t("Register*FirstNameRequeiredValidation"),
                },
                {
                  min: 5,
                  message: t("Register*FirstNameMinLengthValidation"),
                },
                {
                  max: 15,
                  message: t("Register*FirstNameMaxLengthValidation"),
                },
              ]}
            >
              <Input
                prefix={<FaUser />}
                placeholder={t("Register*FirstName")}
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              label={t("Register*LastName")}
              required={false}
              rules={[
                {
                  required: true,
                  message: t("Register*LastNameRequeiredValidation"),
                },
                {
                  min: 5,
                  message: t("Register*LastNameMinLengthValidation"),
                },
                {
                  max: 15,
                  message: t("Register*LastNameMaxLengthValidation"),
                },
              ]}
            >
              <Input prefix={<FaUser />} placeholder={t("Register*LastName")} />
            </Form.Item>
            <Form.Item
              name="password"
              extra={parse(t("Register*PasswordRequirements"))}
              label={t("Register*Password")}
              required={false}
              rules={[
                {
                  required: true,
                  message: t("Register*PasswordRequiredValidation"),
                },
                {
                  min: 8,
                  message: t("Register*PasswordMinLengthValidation"),
                },
                {
                  max: 10,
                  message: t("Register*PasswordMaxLengthValidation"),
                },
                {
                  pattern: new RegExp(
                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,10}$"
                  ),
                  message: t("Register*PasswordPatternValidation"),
                },
              ]}
            >
              <Input.Password
                prefix={<FaLock />}
                placeholder={t("Register*Password")}
                iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
                visibilityToggle={{
                  visible: showPassword,
                  onVisibleChange: setShowPassword,
                }}
              />
            </Form.Item>

            <Form.Item
              name="confirm"
              label={t("Register*Password*Confirm")}
              dependencies={["password"]}
              required={false}
              rules={[
                {
                  required: true,
                  message: t("Register*PasswordRequiredValidation"),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t("Register*PasswordConfirmError"))
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<FaLock />}
                placeholder={t("Register*Password")}
                iconRender={(visible) => (visible ? <FaEye /> : <FaEyeSlash />)}
                visibilityToggle={{
                  visible: showPassword,
                  onVisibleChange: setShowPassword,
                }}
              />
            </Form.Item>
          </Form>
        </div>
      </Content>
      <Footer className="mc-footer">
        <Flex align="center" gap={16} style={{ width: "100%" }}>
          <Button block type="dashed" danger onClick={() => nav("/login")}>
            {t("Register*CancelButton")}
          </Button>
          <Button
            type="primary"
            block
            onClick={() => {
              form.submit();
            }}
          >
            {t("Register*RegisterButton")}
          </Button>
        </Flex>
      </Footer>
    </Layout>
  );
};

export default Register;
