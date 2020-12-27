import React, { useCallback } from "react";
import { useRouter } from "next/router";

import { Form, Formik } from "formik";
import { Box, Button, Link } from "@chakra-ui/react";
import Wrapper from "../components/Wrapper";
import InputField from "../components/InputField";
import { useLoginMutation, MeQuery, MeDocument } from "../generated/graphql";
import toErrorMap from "../utils/toErrorMap";
import NavBar from "../components/NavBar";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";

const Login: React.FC = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  const handleSubmit = useCallback(
    async (
      values: { usernameOrEmail: string; password: string },
      { setErrors }
    ) => {
      const response = await login({
        variables: values,
        update: (cache, { data }) => {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: "Query",
              me: data?.login.user,
            },
          });
          cache.evict({ fieldName: "posts:{}" });
        },
      });
      if (response.data?.login.errors) {
        setErrors(toErrorMap(response.data.login.errors));
      } else if (response.data?.login.user) {
        if (typeof router.query.next === "string") {
          router.push(router.query.next);
        } else {
          // worked
          router.push("/");
        }
      }
    },
    []
  );
  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="usernameOrEmail"
                placeholder="Username or Email"
                label="Username or Email"
              />

              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button
                mt={4}
                isLoading={isSubmitting}
                colorScheme="teal"
                type="submit"
              >
                Login
              </Button>
              <br />
              <NextLink href="/forgot-password">
                <Link>Forgot Password?</Link>
              </NextLink>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(Login);
