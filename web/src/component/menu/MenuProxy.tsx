import { FunctionComponent, useEffect, useState } from "react";
import { MenuItem } from "../../entity/MenuItem";
import { useLocation } from "react-router-dom";
import { MenuScreen } from "./MenuScreen";
import { Command } from "../../entity/Command";

const findMenuItemByPath = (root: MenuItem | undefined, path: string[]): MenuItem | undefined => {
    let currentMenu: MenuItem | undefined = root;

    for (const code of path) {
        if (currentMenu === undefined) {
            break;
        }

        if (code === "root" && currentMenu.code === "root") {
            continue;
        }

        const foundItem = currentMenu.children.find(item => item.code === code);

        if (!foundItem) {
            currentMenu = undefined;
            break;
        }

        currentMenu = foundItem;
    }

    return currentMenu;
}

export const MenuProxy: FunctionComponent<MenuProxyProps> = props => {
    const [hvacMenu, setHvacMenu] = useState<MenuItem | undefined>(undefined);
    const { command } = props;
    let path = useLocation().pathname.split("/").filter(p => p.length);

    useEffect(() => {
        if (hvacMenu) {
            return;
        }

        fetch("hvac-menu.json")
            .then(response => response.json())
            .then(response => setHvacMenu(response));
    }, [hvacMenu]);

    if (!hvacMenu) {
        return <div>Loading menu...</div>;
    }

    if (path.length === 0) {
        path.push("root");
    }

    const foundMenuItem = findMenuItemByPath(hvacMenu, path);

    if (!foundMenuItem) {
        return <div>Menu item not found in path: {path.join("/")}</div>;
    }

    return <MenuScreen menuItem={foundMenuItem} path={path} command={command} />
}

export interface MenuProxyProps {
    command: Command | undefined;
}