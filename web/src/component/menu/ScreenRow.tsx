import React, {FunctionComponent, PropsWithChildren} from "react";
import "./ScreenRow.css";

export const ScreenRow: FunctionComponent<PropsWithChildren<ScreenRowProps>> = props => {
    if (props.component) {
        const Wrapper = props.component;
        return <Wrapper className={`screen-row ${props.isSelected ? 'screen-row-selected' : ''}`}>
            {props.children}
        </Wrapper>
    }

    return <div className={`screen-row ${props.isSelected ? 'screen-row-selected' : ''}`}>
        {props.children}
    </div>
}

export interface ScreenRowProps {
    component?: React.ElementType;
    isSelected?: boolean;
}