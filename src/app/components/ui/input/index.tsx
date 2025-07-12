import { JSX } from 'react';
import FieldError from '../field-error';
import { FormValidationData } from '@/models/common';

type InputProps<T> = Omit<JSX.IntrinsicElements['input'], 'id' | 'name'> & {
  name: string;
  label: string;
  formValidationData: FormValidationData<T>;
};

export default function Input<T>({ label, formValidationData, ...props }: InputProps<T>) {
  return (
    <div>
      <label htmlFor={props.name}>{label}</label>
      <input id={props.name} {...props}/>
      <FieldError
        status={(formValidationData as FormValidationData<any>)[props.name].status}
        text={(formValidationData as FormValidationData<any>)[props.name].message}/>
    </div>
  )
}