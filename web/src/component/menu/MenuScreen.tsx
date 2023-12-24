import { FunctionComponent, useEffect, useState } from "react";
import { MenuItem } from "../../entity/MenuItem";
import { useNavigate } from "react-router-dom";
import { Command, CommandCode } from "../../entity/Command";
import { ChildMenuScreen } from "./ChildMenuScreen";

export const MenuScreen: FunctionComponent<MenuScreenProps> = props => {
    const [selectedChild, setSelectedChild] = useState<number>(-1);
    const { command, path, menuItem } = props;
    const navigate = useNavigate();

    useEffect(() => {
        setSelectedChild(-1);
    }, [path]);

    const hasBack = path.length > 1;

    useEffect(() => {
        if (!command) {
            return;
        }

        switch (command.code) {
            case CommandCode.Click:
                if (selectedChild < menuItem.children.length) {
                    navigate([...path, menuItem.children[selectedChild].code].join("/"))
                }
                else {
                    const newParentCodes = [...props.path];
                    newParentCodes.pop();
                    navigate(newParentCodes.join("/"));
                }
                break;
            case CommandCode.Right:
            case CommandCode.Left:
                let newSelectedChild = selectedChild + (command.code === CommandCode.Right ? 1 : -1);

                if (newSelectedChild > menuItem.children.length + (hasBack ? 0 : -1)) {
                    newSelectedChild = 0;
                }

                if (newSelectedChild < 0) {
                    newSelectedChild = menuItem.children.length + (hasBack ? 0 : -1);
                }

                setSelectedChild(newSelectedChild);
                break;
        }
    }, [command]);

    return <div>
        <h1>{props.menuItem.code}</h1>
        <ul>
            {props.menuItem.children.map((child, index) => <ChildMenuScreen
                key={child.code}
                {...child}
                selected={index === selectedChild} />)}
            {hasBack && <ChildMenuScreen
                code="back"
                selected={props.menuItem.children.length === selectedChild} />}
        </ul>
    </div>
};

export interface MenuScreenProps {
    menuItem: MenuItem;
    path: string[];
    command: Command | undefined;
}