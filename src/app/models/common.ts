export interface FormValidationEntry {
  status: boolean;
  message: string;
}
export type FormValidationData<T> = Record<keyof T, FormValidationEntry>;