import {createContext, FunctionComponent, PropsWithChildren, useContext, useState} from "react";
import {Parameter} from "../entity/Parameter";

const myParameters = [
    {name: 'temperature', uom: '° C', value: 21.2, isReadonly: true, type: 'number'},
    {name: 'setPoint', uom: '° C', value: 22, isReadonly: false, type: 'number'},
    {name: 'humidity', uom: '%', value: 87, isReadonly: true, type: 'number'},
    {name: 'co2', uom: 'PPM', value: 300, isReadonly: true, type: 'number'},
    {name: 'alarmTempMin', uom: '° C', value: 19, isReadonly: false, type: 'number'},
    {name: 'alarmTempMax', uom: '° C', value: 24, isReadonly: false, type: 'number'},
    {name: 'alarmTempEnabled', value: true, isReadonly: false, type: 'boolean'},
    {name: 'alarmHumMin', uom: '%', value: 70, isReadonly: false, type: 'number'},
    {name: 'alarmHumMax', uom: '%', value: 90, isReadonly: false, type: 'number'},
];

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
    const [parameters, setParameters] = useState<Parameter[]>(myParameters)

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