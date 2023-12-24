export interface MenuItem {
    code: string;
    children: MenuItem[];
    editable: boolean;
    parameterName: string;
}