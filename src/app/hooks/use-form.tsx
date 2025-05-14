import { ChangeEvent, FormEvent, useState } from "react";
import { FormValidationData, FormValidationEntry } from "../models/common";

// custom form hook, baby!
export default function useForm<T extends {}>(initialState: T, submitFn: (data: T) => void) {
  const [formData, setFormData] = useState<T>(initialState);
  const [formValidationData, setFormValidationData] = useState<FormValidationData<T>>(
    Object.keys(initialState).reduce((acc, key) => {
      acc[key as keyof T] = { status: true, message: "" };
      return acc;
    }, {} as FormValidationData<T>)
  );
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!Object.values<FormValidationEntry>(formValidationData).every(entry => entry.status)) {
      console.error('form validation error');
    } else {
      submitFn(formData);
    }
  };
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormValidationData({...formValidationData, [e.target.name]: {status: e.target.validity.valid, message: e.target.validationMessage}});
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  return { handleInputChange, handleSubmit, formValidationData };
}