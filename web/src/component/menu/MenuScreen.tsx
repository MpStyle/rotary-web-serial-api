import {FunctionComponent, useEffect, useState} from "react";
import {MenuItem} from "../../entity/MenuItem";
import {useNavigate} from "react-router-dom";
import {Command, commandBuilder, CommandCode} from "../../entity/Command";
import {ChildMenuScreen} from "./ChildMenuScreen";
import "./MenuScreen.css";
import {ScreenRow} from "./ScreenRow";

export const MenuScreen: FunctionComponent<MenuScreenProps> = props => {
    const [selectedChild, setSelectedChild] = useState<number>(-1);
    const {command, path, menuItem} = props;
    const navigate = useNavigate();

    const hasBack = path.length > 1;

    const handleChildMenuNavigation = (command: Command) => {
        setSelectedChild(selectedChild => {
            let newSelectedChild = selectedChild + (command.code === CommandCode.Right ? 1 : -1);

            if (newSelectedChild > menuItem.children.length + (hasBack ? 0 : -1)) {
                newSelectedChild = 0;
            }

            if (newSelectedChild < 0) {
                newSelectedChild = menuItem.children.length + (hasBack ? 0 : -1);
            }

            return newSelectedChild;
        });
    }

    const handleChildMenuClick = () => {
        if (selectedChild < menuItem.children.length) {
            const selectedChildren = menuItem.children[selectedChild];
            if (!selectedChildren?.children || selectedChildren.children.length <= 0) {
                return;
            }

            navigate([...path, menuItem.children[selectedChild].code].join("/"))
        } else { // go back
            const newParentCodes = [...props.path];
            newParentCodes.pop();
            navigate(newParentCodes.join("/"));
        }
    }

    const handleKeyPress = (event: KeyboardEvent) => {
        console.log(event.key);
        switch (event.key) {
            case "Enter":
            case "ArrowRight":
                handleChildMenuClick();
                break;
            case "ArrowUp":
                handleChildMenuNavigation(commandBuilder(CommandCode.Left));
                break;
            case "ArrowDown":
                handleChildMenuNavigation(commandBuilder(CommandCode.Right));
                break;
        }
    };

    useEffect(() => {
        setSelectedChild(-1);
    }, [path]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [selectedChild]);

    useEffect(() => {
        if (!command) {
            return;
        }

        switch (command.code) {
            case CommandCode.Click:
                handleChildMenuClick();
                break;
            case CommandCode.Right:
            case CommandCode.Left:
                handleChildMenuNavigation(command);
                break;
        }
    }, [command]);

    return <div className="menu-screen">
        <ScreenRow isSelected={true}><h1>{props.menuItem.code}</h1></ScreenRow>
        <ul>
            {props.menuItem.children.map((child, index) =>
                <ScreenRow component={'li'} key={child.code} isSelected={index === selectedChild}>
                    <ChildMenuScreen
                        onMouseOver={() => setSelectedChild(index)}
                        onClick={() => handleChildMenuClick()}
                        altText=">"
                        {...child}/>
                </ScreenRow>)}
            {hasBack && <ScreenRow isSelected={props.menuItem.children.length === selectedChild}>
                <ChildMenuScreen
                    code="back"
                    onClick={() => handleChildMenuClick()}
                    onMouseOver={() => setSelectedChild(props.menuItem.children.length)}/>
            </ScreenRow>}
        </ul>
        {Array(8 - props.menuItem.children.length - 1 > 0 ? 8 - props.menuItem.children.length - 1 : 0).fill(0).map((_, i) =>
            <ScreenRow key={`empty-scree-row-${i}`}>&nbsp;</ScreenRow>)}
    </div>
};

export interface MenuScreenProps {
    menuItem: MenuItem;
    path: string[];
    command: Command | undefined;
}