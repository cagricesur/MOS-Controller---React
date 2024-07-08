import {
  Button,
  Card,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  List,
  Typography,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCheck, FaGear, FaPen, FaX } from "react-icons/fa6";
import { useLoaderData } from "react-router-dom";
import { Config, GetConfigsResponse, UpdateConfigsRequest } from "../../models";
import { HttpService } from "../../utils";

const Configs: React.FunctionComponent = () => {
  const response = useLoaderData() as GetConfigsResponse;
  const [config, setConfig] = useState<Config | undefined>(undefined);
  const [configs, setConfigs] = useState<Config[]>(response.configs);
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [form] = Form.useForm<Config>();
  const { t } = useTranslation();

  const onReset = () => {
    setConfig(undefined);
    setDrawerOpen(false);
  };
  const onFinish = async (newConfig: Config) => {
    if (newConfig) {
      const index = configs.findIndex((c) => c.key === newConfig.key);
      if (index > -1) {
        setConfigs([
          ...[...configs].splice(0, index),
          newConfig,
          ...[...configs].splice(index + 1),
        ]);
        const request: UpdateConfigsRequest = {
          config: newConfig,
          successMessage: t("Configs*Edit*SuccessMessage"),
        };
        await HttpService.post("/api/app/updateconfigs", request);
      }
    }
    setConfig(undefined);
    setDrawerOpen(false);
  };

  return (
    <>
      <Drawer
        destroyOnClose
        closable={false}
        placement="bottom"
        open={isDrawerOpen}
        onClose={() => {
          setDrawerOpen(false);
        }}
      >
        <Flex vertical gap={16}>
          {config?.description && (
            <Typography.Text ellipsis>{config.description}</Typography.Text>
          )}
          <Form form={form} onFinish={onFinish} onReset={onReset}>
            <Form.Item
              name="key"
              label={t("Config*Edit*KeyLabel")}
              initialValue={config?.key}
              required={false}
            >
              <Input disabled placeholder={t("Config*Edit*KeyLabel")}></Input>
            </Form.Item>
            <Form.Item
              name="value"
              label={t("Config*Value*KeyLabel")}
              initialValue={config?.value}
              required={false}
              rules={[
                {
                  required: true,
                  message: t("Configs*ValueRequiredMessage"),
                },
              ]}
            >
              <Input placeholder={t("Config*Value*KeyLabel")}></Input>
            </Form.Item>
            <Form.Item className="fi-control-mt-30">
              <Flex gap={16}>
                <Button
                  block
                  icon={<FaX color="#8b0000" />}
                  htmlType="reset"
                ></Button>

                <Button
                  block
                  icon={<FaCheck color="#008b00" />}
                  htmlType="submit"
                ></Button>
              </Flex>
            </Form.Item>
          </Form>
        </Flex>
      </Drawer>
      {configs.length === 0 ? (
        <Empty
          description={t("Configs*Empty")}
          style={{ marginTop: "10rem" }}
        ></Empty>
      ) : (
        <List
          className="config-list"
          rowKey={(config) => config.key}
          dataSource={configs}
          renderItem={(config) => {
            return (
              <List.Item>
                <Card
                  className="config-list-item"
                  onClick={() => {
                    setConfig(config);
                    form.resetFields();
                    setDrawerOpen(true);
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
                    avatar={<FaGear size={36} />}
                    title={
                      <Typography.Title level={3} ellipsis>
                        {config.key}
                      </Typography.Title>
                    }
                    description={
                      <Flex vertical gap={16}>
                        {config.description && (
                          <Typography.Text ellipsis>
                            {config.description}
                          </Typography.Text>
                        )}
                        <Typography.Text ellipsis>
                          {config.value}
                        </Typography.Text>
                      </Flex>
                    }
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
export default Configs;
