import { FunctionComponent } from "react";

export const ChildMenuScreen: FunctionComponent<ChildMenuScreenProps> = props => {
    return <li style={props.selected ? { backgroundColor: 'grey' } : {}}>
        <h2>{props.code}</h2>
        {props.parameterName && <div>{props.parameterName}</div>}
    </li>;
}

export interface ChildMenuScreenProps {
    selected?: boolean;
    code: string;
    parameterName?: string;
}