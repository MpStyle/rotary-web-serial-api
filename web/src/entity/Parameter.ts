export interface Parameter {
    name: string;
    value: string | number | boolean;
    type: string;
    uom?: string;
    isReadonly: boolean;
}