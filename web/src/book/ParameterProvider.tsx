import {createContext, FunctionComponent, PropsWithChildren, useContext, useEffect, useState} from "react";
import {Parameter} from "../entity/Parameter";

interface ParameterContextState {
    getParameter: (parameterName: string) => Parameter | undefined;
    setParameter: (parameterName: string, parameterValue: string | boolean | number) => boolean;
}

const ParameterContextDefaultValue: ParameterContextState = {
    getParameter: (_parameterName: string): Parameter | undefined => undefined,
    setParameter: (_parameterName: string, _parameterValue: string | boolean | number) => false
};

const ParameterContext = createContext(ParameterContextDefaultValue);

export const ParameterProvider: FunctionComponent<PropsWithChildren> = props => {
    const [parameters, setParameters] = useState<Parameter[] | undefined>(undefined)

    useEffect(() => {
        if (parameters) {
            return;
        }

        fetch("hvac-params.json")
            .then(response => response.json())
            .then(response => setParameters(response));
    }, [parameters]);

    if(!parameters){
        return <div>Loading parameters....</div>
    }

    return <ParameterContext.Provider value={{
        getParameter: (parameterName: string): Parameter | undefined => parameters.find(p => p.name === parameterName),
        setParameter: (parameterName, parameterValue) => {
            const index = parameters.findIndex(p => p.name === parameterName);

            if (index === -1) {
                console.log(`Parameter "${parameterName}" not found`);
                return false;
            }

            if (parameters[index].type !== typeof parameterValue) {
                console.log(`Type mismatch: cannot assign value of type "${typeof parameterValue}" to type "${parameters[index].type}"`);
                return false;
            }

            const newParams = parameters.map((param, i) =>
                index === i ? { ...param, value: parameterValue } : param
            );

            setParameters(newParams);

            return true;
        }
    }}>
        {props.children}
    </ParameterContext.Provider>
}

export const useParameterProvider = () => useContext(ParameterContext);