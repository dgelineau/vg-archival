import { HomeOutlined } from "@ant-design/icons";
import { Layout } from "antd";
import MenuBuilder from "components/MenuBuilder";

const { Header, Content } = Layout;

const menuStructure = [
  {
    key: "/",
    text: "Dashboard",
    icon: <HomeOutlined />,
    href: "/",
    groups: [],
    requireSession: false,
  },
  {
    key: "consoles",
    text: "Consoles",
    icon: <HomeOutlined />,
    href: "/consoles",
    groups: [
      {
        key: "nintendo",
        title: "Nintendo",
        subItems: [
          {
            key: "/consoles/virtual-boy",
            text: "Virtual Boy",
            href: "/consoles/virtual-boy",
          },
        ],
      },
      {
        key: "sony",
        title: "Sony",
        subItems: [
          {
            key: "/consoles/playstation-2",
            text: "PlayStation 2",
            href: "/consoles/playstation-2",
          },
        ],
      },
    ],
    requireSession: false,
  },
];

const menuConfig = {
  theme: "dark",
  mode: "horizontal",
};

function PageLayout({ children }) {
  return (
    <Layout>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <MenuBuilder items={menuStructure} config={menuConfig} />
      </Header>
      <Content className="site-layout" style={{ marginTop: 64 }}>
        <div
          className="site-layout-background"
          style={{ padding: 24, minHeight: 380 }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
}

PageLayout.propTypes = {};

export default PageLayout;
