import { Menu } from "antd";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, signOut, useSession } from "next-auth/client";
import styles from "./MenuBuilder.module.css";

const { SubMenu } = Menu;

const MenuBuilder = ({ items, config }) => {
  const [session] = useSession();
  const { asPath } = useRouter();

  return (
    <Menu {...config} selectedKeys={asPath}>
      {items.map(({ key, text, icon, href, groups, requireSession }) => {
        if (requireSession && !session) {
          return null;
        }

        if (groups.length > 0) {
          return (
            <SubMenu title={text} key={key} icon={icon}>
              {groups.map(({ key, title, subItems }) => (
                <Menu.ItemGroup title={title} key={key}>
                  {subItems.map(({ key, text, icon, href }) => (
                    <Menu.Item key={key} icon={icon}>
                      <Link href={href}>{text}</Link>
                    </Menu.Item>
                  ))}
                </Menu.ItemGroup>
              ))}
            </SubMenu>
          );
        }

        return (
          <Menu.Item key={key} icon={icon}>
            <Link href={href}>{text}</Link>
          </Menu.Item>
        );
      })}

      {!session ? (
        <Menu.Item
          key="sign-in"
          icon={<LoginOutlined />}
          onClick={() => signIn("github")}
          className={styles.floatRight}
        >
          Sign In
        </Menu.Item>
      ) : (
        <Menu.Item
          key="sign-out"
          icon={<LogoutOutlined />}
          onClick={() => signOut()}
          className={styles.floatRight}
        >
          Sign Out
        </Menu.Item>
      )}
    </Menu>
  );
};

MenuBuilder.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
      href: PropTypes.string.isRequired,
      groups: PropTypes.array.isRequired,
    })
  ),
};

export default MenuBuilder;
