import { useCallback } from "react";
import { useLazyEffect } from "hooks/useLazyEffect";
import {
  Drawer,
  Form,
  Button,
  Col,
  Row,
  Input,
  Select,
  DatePicker,
  Divider,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  esrbRatings,
  esrbOptions,
  genres,
  genreOptions,
} from "constants/index";
import styles from "./GameDrawer.module.css";

const validateMessages = {
  required: "${label} is a required field.",
  enum: "${label} must be one of ${enum}",
  whitespace: "${label} cannot be empty",
  string: {
    max: "${label} cannot be longer than ${max} characters.",
  },
  types: {
    date: "${label} is not a valid date.",
  },
};

function CsvDrawer({
  csvData: { games, isDrawerOpen },
  toggleVisibility,
  onSuccess,
  mutationIsLoading,
  existingGames,
}) {
  const [form] = Form.useForm();

  useLazyEffect(() => {
    form.setFieldsValue({ games });
  }, [form, games]);

  const handleFinish = (values) => {
    if (onSuccess) onSuccess(values);
  };

  const submit = () => {
    form.submit();
  };

  const internalToggle = useCallback(() => {
    if (form) form.resetFields([]);
    if (toggleVisibility) toggleVisibility();
  }, [form, toggleVisibility]);

  return (
    <>
      <Drawer
        title="Games"
        width={"100%"}
        onClose={internalToggle}
        visible={isDrawerOpen}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Button onClick={internalToggle} block>
                Cancel
              </Button>
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                block
                loading={mutationIsLoading}
                onClick={submit}
              >
                Submit
              </Button>
            </Col>
          </Row>
        }
      >
        <Form
          form={form}
          layout="vertical"
          hideRequiredMark
          onFinish={handleFinish}
          validateMessages={validateMessages}
        >
          <Form.List
            name="games"
            rules={[
              {
                validator: async (_, games) => {
                  if (!games || games.length < 1) {
                    return Promise.reject(
                      new Error("You must have at least one game added.")
                    );
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                  return (
                    <Row gutter={[16, 16]} key={field.key}>
                      <Col span={24}>
                        <Divider>Game {index + 1}</Divider>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[index, "title"]}
                          label="Title"
                          rules={[
                            { required: true, max: 255, whitespace: true },
                          ]}
                        >
                          <Input placeholder="Game Title" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[index, "genre"]}
                          label="Genre"
                          rules={[
                            {
                              required: true,
                              type: "enum",
                              enum: genres,
                              whitespace: true,
                            },
                          ]}
                        >
                          <Select options={genreOptions} allowClear />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[index, "upc"]}
                          label="UPC"
                          rules={[
                            { required: true, max: 255, whitespace: true },
                            {
                              validator: async (_, value) => {
                                if (
                                  existingGames.some(
                                    (game) => game.upc === value
                                  )
                                ) {
                                  return Promise.reject(
                                    new Error(
                                      "There is already a game with this UPC."
                                    )
                                  );
                                }
                              },
                            },
                          ]}
                        >
                          <Input placeholder="Game UPC" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[index, "publisher"]}
                          label="Publisher"
                          rules={[
                            { required: true, max: 255, whitespace: true },
                          ]}
                        >
                          <Input placeholder="Game Publisher" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[index, "developer"]}
                          label="Developer"
                          rules={[
                            { required: true, max: 255, whitespace: true },
                          ]}
                        >
                          <Input placeholder="Game Developer" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[index, "rating"]}
                          label="Rating"
                          rules={[
                            {
                              required: true,
                              type: "enum",
                              enum: esrbRatings,
                              whitespace: true,
                            },
                          ]}
                        >
                          <Select options={esrbOptions} allowClear />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name={[index, "release"]}
                          label="Release Date"
                          rules={[
                            { required: true, type: "date", whitespace: true },
                          ]}
                        >
                          <DatePicker className={styles.fullWidth} />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          name={[index, "description"]}
                          label="Description"
                          rules={[
                            { required: true, max: 1000, whitespace: true },
                          ]}
                        >
                          <Input.TextArea placeholder="Game Description" />
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item>
                          <Button
                            onClick={() => remove(field.name)}
                            icon={<DeleteOutlined />}
                            block
                            type="danger"
                            ghost
                          >
                            Delete
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                  );
                })}
                <Divider />
                <Row>
                  <Button
                    type="primary"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Game
                  </Button>
                </Row>
              </>
            )}
          </Form.List>
        </Form>
      </Drawer>
    </>
  );
}

export default CsvDrawer;
