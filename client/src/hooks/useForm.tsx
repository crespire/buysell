import { ChangeEventHandler, FocusEventHandler, useEffect, useState } from 'react';

interface FormHookInterface {
  values: Record<string, any>;
  errors: Record<string, any>;
  handleChange: ChangeEventHandler;
  handleFiles: ChangeEventHandler;
  updateFiles: ChangeEventHandler;
  handleSubmit: (e:React.SyntheticEvent, ...args:string[]) => void;
  handleBlur: FocusEventHandler;
}

interface InputFieldValuesInterface {
  property: string,
  value: string,
  pattern: string,
  validationMsg: string;
}

const useForm = (callback: any, defaultValues: Record<string, any> = {}): FormHookInterface => {
  const [values, setValues] = useState<Record<string, any>>(defaultValues);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [touched, setTouched] = useState<string[]>([]);

  useEffect(() => {
    if (Object.keys(defaultValues).length > 0) {
      setValues(defaultValues);
    }    
  }, [defaultValues])

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

    setValues({
      ...values,
      [property]: files,
    });
  };

  // Handler for file update
  const updateFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const target = e.target as HTMLInputElement;
    const checked = target.checked;
    const fileName = target.name;

    if (checked) {
      setValues(prevState => {
        let { images_to_purge, ...rest } = prevState;
        let updatedFiles;

        if (images_to_purge) {
          updatedFiles = images_to_purge.concat(fileName)
        } else {
          updatedFiles = [fileName]
        }

        return {...rest, 'images_to_purge': updatedFiles};
      })
    } else {
      setValues(prevState => {
        let { images_to_purge, ...rest } = prevState;

        if (images_to_purge) {
          let updatedFiles = images_to_purge.filter((file: string) => file !== fileName)

          return {...rest, 'images_to_purge': updatedFiles}
        }
      })
    }
  };

  const handleSubmit = (e: React.SyntheticEvent, ...args: string[]): void => {
    e.preventDefault();

    if (Object.keys(errors).length === 0 && Object.keys(values).length > 0) {
      console.log(callback);
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
          // Is Mutation?
          if (callback.hasOwnProperty('mutate')) {
            console.log('Mutation found');
            callback.mutate(values);
          } else {
            console.log('Callback name not recognized, calling without args.');
            callback();
          }
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
    updateFiles,
    handleSubmit,
    handleBlur
  };
};

export default useForm;