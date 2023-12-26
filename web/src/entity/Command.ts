export type Command = { now: number, code: number };

export const commandBuilder=(code:number):Command=>({
    now: new Date().getTime(),
    code
});

export enum CommandCode {
    Click = 1,
    Right = 2,
    Left = 3,
}