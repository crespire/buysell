import { ChangeEventHandler, FocusEventHandler, useState } from 'react';

interface FormHookInterface {
  values: Record<string, any>;
  errors: Record<string, any>;
  handleChange: ChangeEventHandler;
  handleFiles: ChangeEventHandler;
  handleSubmit: (e:React.SyntheticEvent, ...args:string[]) => void;
  handleBlur: FocusEventHandler;
}

interface InputFieldValuesInterface {
  property: string,
  value: string,
  pattern: string,
  validationMsg: string;
}

const useForm = (callback: Function, defaultValues = {}): FormHookInterface => {
  const [values, setValues] = useState<Record<string, any>>(defaultValues);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [touched, setTouched] = useState<string[]>([]);

  const validate = (property:string, value:string, pattern:string, message:string): void => {
    const errorRemover = (): void => {
      let newErrors = {...errors};
      delete newErrors[property];
      setErrors(newErrors);
    };

    // Property 'pattern' doesn't exist on <textarea>, so hacky regex validation
    if (!pattern && property === 'body') {
      pattern = '.{5,}';
    };

    const regex = new RegExp(pattern);
    regex.test(value)
      ? errorRemover()
      : setErrors({...errors, [property]: message});
  };

  const eventDetails = (e: React.SyntheticEvent): InputFieldValuesInterface => {
    const target = e.target as HTMLInputElement;
    const property = target.name;
    const value = target.value;
    const pattern = target.pattern;
    const validationMsg = target.dataset.error || 'Error, please check field.';

    return { property, value, pattern, validationMsg };
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    const { property, value, pattern, validationMsg } = eventDetails(e);

    if (touched.includes(property)) {
      validate(property, value, pattern, validationMsg);
    }

    setValues({
      ...values,
      [property]: value,
    });
  };

  // Handler for file upload
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const target = e.target as HTMLInputElement;
    const property = target.name;
    const files = target.files;

    console.log(files);

    setValues({
      ...values,
      [property]: files,
    });
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
          callback(args[0], args[1]);
          break;
        case 'logOut':
          console.log('Sending logout...');
          break;
        case 'submitForm':
          console.log('Submitting new post...');
          callback();
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
   
    const { property, value, pattern, validationMsg } = eventDetails(e);

    if (!touched.includes(property) && value.length > 0) {
      validate(property, value, pattern, validationMsg);
    }
    
    setTouched(prev => {
      if (!prev.includes(property) && value.length > 0) { return [...prev, property]; }

      return prev;
    });
  }

  return {
    values,
    errors,
    handleChange,
    handleFiles,
    handleSubmit,
    handleBlur};
};

export default useForm;