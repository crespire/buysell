import { ChangeEventHandler, FocusEventHandler, useState } from 'react';

interface KeyedStateInterface {
  [property: string]: string
}

interface FormHookInterface {
  values: KeyedStateInterface;
  errors: KeyedStateInterface;
  handleChange: ChangeEventHandler;
  handleSubmit: (e:React.SyntheticEvent, ...args:string[]) => void;
  handleBlur: FocusEventHandler;
}

const useForm = (callback: Function): FormHookInterface => {
  const [values, setValues] = useState<KeyedStateInterface>({});
  const [errors, setErrors] = useState<KeyedStateInterface>({});
  const [touched, setTouched] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const target = e.target;
    const property = target.name;
    const value = target.value;
    const pattern = target.pattern;
    const passConf = target.dataset.confirm || false;
    const validationMsg = target.dataset.error || 'Error, please check field.';

    if (touched.includes(property)) {
      validate(property, value, passConf ? values['pass'] : pattern, validationMsg);
    }

    setValues({
      ...values,
      [property]: value,
    });
  };

  const validate = (property:string, value:string, pattern:string, message:string): void => {
    const errorRemover = (): void => {
      let newErrors = {...errors};
      delete newErrors[property];
      setErrors(newErrors);
    };

    const regex = new RegExp(pattern);
    regex.test(value)
      ? errorRemover()
      : setErrors({...errors, [property]: message});
  };

  const handleSubmit = (e: React.SyntheticEvent, ...args: string[]): void => {
    e.preventDefault();

    if (Object.keys(errors).length === 0 && Object.keys(values).length > 0) {
      switch(callback.name) {
        case 'signUp':
          console.log('Submitting sign up...');
          callback(args[0], args[1]);
          break;
        case 'logIn':
          console.log('Sending credentials for login...');
          break;
        case 'verifyUser':
          console.log('Verifying user...');
          break;
        case 'logOut':
          console.log('Sending logout...');
          break;
        default:
          console.log('Callback name not recognized, calling without args.');
          callback();
      }
      console.log('Submitted');
    } else {
      console.log("Didn't pass validation, did nothing.");
    }
  };

  const handleBlur = (e: React.FocusEvent): void => {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const property = target.name;
    const value = target.value;
    const pattern = target.pattern;
    const passConf = target.dataset.confirm || false;
    const validationMsg = target.dataset.error || 'Error, please check field.';

    if (!touched.includes(property) && value.length > 0) {
      validate(property, value, passConf ? values['pass'] : pattern, validationMsg);
    }
    
    setTouched(prev => {
      if (!prev.includes(property) && value.length > 0) { return [...prev, property]; }

      return prev;
    });
  }

  return {values, errors, handleChange, handleSubmit, handleBlur};
};

export default useForm;