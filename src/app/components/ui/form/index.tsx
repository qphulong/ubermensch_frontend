import { JSX } from 'react';

type FormProps = Omit<JSX.IntrinsicElements['form'], 'noValidate'>;

export default function Form(props: FormProps) {
  return (
    <form {...props} noValidate/>
  )
}