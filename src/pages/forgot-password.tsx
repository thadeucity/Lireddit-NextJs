import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useCallback, useState } from "react";
import InputField from "../components/InputField";
import NavBar from "../components/NavBar";
import Wrapper from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const ForgotPassword: React.FC = ({}) => {
  const [complete, setComplete] = useState(false);

  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = useCallback(
    async (values: { email: string }, { setErrors }) => {
      await forgotPassword({ variables: values });

      setComplete(true);
    },
    []
  );

  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik initialValues={{ email: "" }} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="email"
                placeholder="Email"
                label="Email"
                type="email"
              />

              <Button
                mt={4}
                isLoading={isSubmitting}
                colorScheme="teal"
                type="submit"
              >
                Recover Password
              </Button>
            </Form>
          )}
        </Formik>
        <br />
        {complete && (
          <Box style={{ color: "red" }}>Email enviado com sucesso</Box>
        )}
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
