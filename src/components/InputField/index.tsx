import React, { HTMLAttributes } from "react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";

type InputFieldProps = HTMLAttributes<HTMLInputElement> & {
  name: string;
  placeholder: string;
  label: string;
  type?: string;
  textArea?: boolean;
};

const InputField: React.FC<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      {props.textArea ? (
        <Textarea
          {...field}
          type={props.type || "text"}
          id={field.name}
          placeholder={props.placeholder}
        />
      ) : (
        <Input
          {...field}
          type={props.type || "text"}
          id={field.name}
          placeholder={props.placeholder}
        />
      )}

      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
