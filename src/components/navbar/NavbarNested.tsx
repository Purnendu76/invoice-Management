import {
  IconDeviceDesktopAnalytics,
  IconGauge,
  IconHome2,
} from "@tabler/icons-react";
import { Title, Tooltip, UnstyledButton } from "@mantine/core";
import { MantineLogo } from "@mantinex/mantine-logo";
import { NavLink, useLocation } from "react-router-dom";
import classes from "./DoubleNavbar.module.css";

const mainLinksData = [
    { icon: IconGauge, label: "Dashboard", path: "/dashboard" },
  { icon: IconHome2, label: "Admin-Invoice", path: "/admin-invoice" },

  { icon: IconDeviceDesktopAnalytics, label: "User-Invoice", path: "/user-invoice" },
];

export default function NavbarNested() {
  const location = useLocation();
  const active = mainLinksData.find(
    (link) => link.path === location.pathname
  )?.label;

  const mainLinks = mainLinksData.map((link) => (
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
          <link.icon size={22} stroke={1.5} />
        </UnstyledButton>
      </NavLink>
    </Tooltip>
  ));

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
        </div>

        <div className={classes.main}>
          <Title order={4} className={classes.title}>
            {active}
          </Title>
          {links}
        </div>
      </div>
    </nav>
  );
}
