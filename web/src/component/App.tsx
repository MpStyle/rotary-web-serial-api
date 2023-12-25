import {FunctionComponent, useState} from 'react';
import {createHashRouter, RouterProvider} from 'react-router-dom';
import {Command, CommandCode} from '../entity/Command';
import {MenuProxy} from './menu/MenuProxy';
import "./App.css";
import {ParameterProvider} from "../book/ParameterProvider";

export const App: FunctionComponent = () => {
    const [serialPort, setState] = useState<SerialPort | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [command, setCommand] = useState<Command | undefined>(undefined);

    const connect = async () => {
        try {
            // Prompt user to select any serial port.
            const port = await navigator.serial.requestPort();

            // Wait for the serial port to open.
            await port.open({baudRate: 9600});

            setState(port);

            while (port.readable) {
                const reader = port.readable.getReader();

                try {
                    while (true) {
                        const {value: values, done} = await reader.read();

                        if (done) {
                            // Allow the serial port to be closed later.
                            reader.releaseLock();
                            break;
                        }

                        if (values) {
                            if (values.constructor === Uint8Array && values.length > 0) {
                                const value = values.filter(v => [CommandCode.Click, CommandCode.Left, CommandCode.Right].includes(v));

                                switch (value[0]) {
                                    case CommandCode.Click:
                                    case CommandCode.Left:
                                    case CommandCode.Right:
                                        setCommand({now: new Date().getTime(), code: value[0]});
                                        break;
                                }
                            }
                        }
                    }
                } catch (error) {
                    setError(error as string);
                }
            }
        } catch (error) {
            console.log(error);
            setError(error as string);
        }
    }

    const router = createHashRouter([
        {
            path: "*",
            element: <MenuProxy command={command}/>,
        },
    ]);

    return <div className="app">
        {!serialPort && <button onClick={() => connect()} className="connect-controller">Connect controller</button>}
        {error && <div style={{backgroundColor: 'red', color: 'white', fontWeight: 'bold'}}>{error}</div>}
        <ParameterProvider>
            <div className="screen">
                <RouterProvider router={router}/>
            </div>
        </ParameterProvider>
    </div>;
}


