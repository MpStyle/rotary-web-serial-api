import {FunctionComponent} from "react";
import "./ChildMenuScreen.css";
import {useParameterProvider} from "../../book/ParameterProvider";

export const ChildMenuScreen: FunctionComponent<ChildMenuScreenProps> = props => {
    const {getParameter, setParameter} = useParameterProvider();
    const parameter = props.parameterName ? getParameter(props.parameterName) : undefined;

    return <div className="child-menu-screen"
                onClick={() => props.onClick()}
                onMouseOver={() => props.onMouseOver()}>
        <h2>{props.code}</h2>
        {props.parameterName && <div>{parameter?.value}{parameter?.uom}</div>}
        {(!props.parameterName && props.altText) && <div>{props.altText}</div>}
    </div>;
}

export interface ChildMenuScreenProps {
    code: string;
    parameterName?: string;
    onMouseOver: () => void;
    onClick: () => void;
    altText?: string;
}