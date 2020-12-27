import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import InputField from "../../components/InputField";
import NavBar from "../../components/NavBar";
import Wrapper from "../../components/Wrapper";
import {
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from "../../generated/graphql";
import toErrorMap from "../../utils/toErrorMap";
import { withApollo } from "../../utils/withApollo";

const ChangePassword: React.FC = () => {
  const [tokenError, setTokenError] = useState("");

  const router = useRouter();

  const [changePassword] = useChangePasswordMutation();

  const handleSubmit = useCallback(
    async (values: { newPassword: string }, { setErrors }) => {
      const response = await changePassword({
        variables: {
          newPassword: values.newPassword,
          token: "",
        },
        update: (cache, { data }) => {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: "Query",
              me: data?.changePassword.user,
            },
          });
          cache.evict({ fieldName: "posts:{}" });
        },
      });

      if (response.data?.changePassword.errors) {
        const errorMap = toErrorMap(response.data.changePassword.errors);
        if ("token" in errorMap) {
          setTokenError(errorMap.token);
        }
        setErrors(errorMap);
      } else if (response.data?.changePassword.user) {
        // worked
        router.push("/");
      }
    },
    []
  );

  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik initialValues={{ newPassword: "" }} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="newPassword"
                placeholder="New Password"
                label="New Password"
                type="password"
              />
              {tokenError && <Box style={{ color: "red" }}>{tokenError}</Box>}
              <Button
                mt={4}
                isLoading={isSubmitting}
                colorScheme="teal"
                type="submit"
              >
                Change Password
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
