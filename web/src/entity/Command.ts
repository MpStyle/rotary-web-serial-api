export type Command = { now: number, code: number };

export enum CommandCode {
    Click = 1,
    Right = 2,
    Left = 3,
}