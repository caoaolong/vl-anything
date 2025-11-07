export interface FieldProps {
    fieldName: string;
    showName: string;
    value: any;
    type: string;
    readonly: boolean;
}

export interface ShapeProps {
    className: string;
    showName: string;
    props: Array<FieldProps>;
}