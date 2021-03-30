import React from "react";
import { Menu } from "antd";
import { LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { signIn, signOut, useSession } from "next-auth/client";

const { SubMenu } = Menu;

const SignInBtn = () => {
  const [session, loading] = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      {!session ? (
        <Menu.Item
          key="sign-in"
          icon={<LoginOutlined />}
          onClick={() => signIn("github")}
        >
          Sign In
        </Menu.Item>
      ) : (
        <Menu.Item
          key="sign-out"
          icon={<LogoutOutlined />}
          onClick={() => signOut()}
        >
          Sign Out
        </Menu.Item>
      )}
    </React.Fragment>
  );
};

SignInBtn.propTypes = {};

export default SignInBtn;
