import { Menu as AntdMenu } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import * as Icons from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { GetMenusResponse, Menu as MenuModel } from "../models";
import { HttpService, useAppStore } from "../utils";

interface MenuProps {
  onMenuClick: () => void;
}

export const Menu: React.FunctionComponent<MenuProps> = (props) => {
  const appStore = useAppStore();
  const [items, setItems] = useState<ItemType[]>([]);
  const [menus, setMenus] = useState<MenuModel[]>([]);
  const { t } = useTranslation();
  const nav = useNavigate();
  const isProtected = useMemo(() => {
    if (
      appStore.profile &&
      appStore.profile.user &&
      appStore.profile.token &&
      appStore.profile.tokenExpiration
    ) {
      const date = new Date(appStore.profile.tokenExpiration);
      return date > new Date();
    }
    return false;
  }, [appStore.profile]);
  const getIcon = (name: string) => {
    const icons = Object.entries(Icons);
    const icon = icons.find((item) => {
      return item[0] === name;
    });
    const FaIcon = icon && icon[1] ? icon[1] : Icons.FaTerminal;
    return FaIcon;
  };
  const getMenu = useCallback(
    (menu: MenuModel, children: MenuModel[]): ItemType | MenuItemType => {
      const MenuIcon = getIcon(menu.icon);
      const item = {
        key: menu.id,
        label: t(`Menu*${menu.caption}`),
        icon: <MenuIcon />,
      } as MenuItemType;
      const _children = _.filter(children, (child) => {
        return child.parentID === menu.id;
      }).map((child) => getMenu(child, children));
      if (_children.length > 0) {
        return { ...item, children: _children } as ItemType;
      } else {
        return item;
      }
    },
    [t]
  );

  const fetchMenu = useCallback(() => {
    if (isProtected) {
      HttpService.get<GetMenusResponse>("/api/app/getmenus").then(
        (response) => {
          const parents = _.filter(response.data.menus, (menu) => {
            if (!menu.parentID) {
              return true;
            }
            return false;
          });
          const children = _.filter(response.data.menus, (menu) => {
            if (menu.parentID && menu.path) {
              return true;
            }
            return false;
          });

          const items = parents.map((parent) => getMenu(parent, children));
          items.push({
            key: "Logout",
            label: t(`Menu*Logout`),
            icon: <Icons.FaPowerOff />,
          });
          setItems(items);
          setMenus(response.data.menus);
        }
      );
    }
  }, [getMenu, isProtected, t]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);
  return (
    <AntdMenu
      mode="inline"
      items={items}
      onClick={(menu) => {
        if (menu.key === "Logout") {
          useAppStore.setState({
            profile: undefined,
          });
        } else {
          const _menu = menus.find((m) => m.id === menu.key);
          if (_menu && _menu.path) {
            props.onMenuClick();
            nav(_menu.path);
          }
        }
      }}
    ></AntdMenu>
  );
};
