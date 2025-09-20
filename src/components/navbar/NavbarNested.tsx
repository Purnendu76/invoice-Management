import {
  IconDeviceDesktopAnalytics,
  IconGauge,
  IconHome2,
  IconLogout,
} from "@tabler/icons-react";
import { Title, Tooltip, UnstyledButton, Button } from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import classes from "./DoubleNavbar.module.css";
import { getUserRole } from "../../lib/utils/getUserRole";
import Cookies from "js-cookie";

export default function NavbarNested() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = getUserRole();

  // ✅ Logout function
const handleLogout = () => {
 Cookies.remove("token", { path: "/" });
   navigate("/", { replace: true }); // redirect to login page
};

  // ✅ Filter links based on role
  const mainLinksData = [
    { icon: IconGauge, label: "Dashboard", path: "/dashboard" },
    ...(role === "Admin"
      ? [{ icon: IconHome2, label: "Admin-Invoice", path: "/admin-invoice" }]
      : []),
    { icon: IconDeviceDesktopAnalytics, label: "User-Invoice", path: "/user-invoice" },
  ];

  const active = mainLinksData.find(
    (link) => link.path === location.pathname
  )?.label;

  const mainLinks = mainLinksData.map((link) => {
    const Icon = link.icon;
    return (
      <Tooltip
        label={link.label}
        position="right"
        withArrow
        transitionProps={{ duration: 0 }}
        key={link.label}
      >
        <NavLink
          to={link.path}
          className={({ isActive }) =>
            `${classes.mainLink} ${isActive ? classes.mainLinkActive : ""}`
          }
        >
          <UnstyledButton>
            <Icon size={22} stroke={1.5} />
          </UnstyledButton>
        </NavLink>
      </Tooltip>
    );
  });

  const links = mainLinksData.map((link) => (
    <NavLink
      to={link.path}
      className={({ isActive }) =>
        `${classes.link} ${isActive ? classes.linkActive : ""}`
      }
      key={link.label}
    >
      {link.label}
    </NavLink>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.wrapper}>
        <div className={classes.aside}>
          <div className={classes.logo}>
            <MantineLogo type="mark" size={30} />
          </div>
          {mainLinks}
          {/* ✅ Logout button with icon */}
          <Tooltip label="Logout" position="right" withArrow>
            <UnstyledButton onClick={handleLogout} className={classes.mainLink}>
              <IconLogout size={22} stroke={1.5} />
            </UnstyledButton>
          </Tooltip>
        </div>

        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            {active}
          </Title>
          {links}
          {/* ✅ Or a big Logout button here */}
          <Button
            variant="outline"
            color="red"
            mt="md"
            onClick={handleLogout}
            leftSection={<IconLogout size={16} />}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
