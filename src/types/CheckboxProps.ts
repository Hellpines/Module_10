export interface CheckboxProps {
    checkboxId: number;
    flagCheckboxes: boolean;
    label: string;
    checked: boolean;
    onChange: () => void;
}