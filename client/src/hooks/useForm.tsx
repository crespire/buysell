import {useState} from 'react';

interface KeyedStateInterface {
  [property: string]: string
}

const useForm = (
  callback = function () {
    console.log('No callback found, but we fired it.');
  }
) => {
  const [values, setValues] = useState<KeyedStateInterface>({});
  const [errors, setErrors] = useState<KeyedStateInterface>({});
  const [touched, setTouched] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const target = e.target;
    const property = target.name;
    const value = target.value;
    const pattern = target.pattern;
    const validationMsg = target.dataset.error || 'Error, please check field.';

    if (touched.includes(property)) {
      validate(property, value, pattern, validationMsg);
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

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length === 0 && Object.keys(values).length > 0) {
      callback();
      console.log('Submitted');
    } else {
      console.log("Didn't pass validation, did nothing.");
    }
  };

  const handleBlur = (e: React.FocusEvent): void => {
    const target = e.target as HTMLInputElement;
    const property = target.name;
    
    setTouched(prev => [...prev, property]);
  }

  return {values, errors, handleChange, handleSubmit, handleBlur};
};

export default useForm;