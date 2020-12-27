import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import InputField from "../components/InputField";
import NavBar from "../components/NavBar";
import Wrapper from "../components/Wrapper";
import { useCreatePostMutation } from "../generated/graphql";
import useIsAuth from "../utils/useIsAuth";
import { withApollo } from "../utils/withApollo";

const CreatePost: React.FC = ({}) => {
  const router = useRouter();

  useIsAuth();

  const [createPost] = useCreatePostMutation();

  const handleSubmit = useCallback(
    async (values: { title: string; text: string }) => {
      const response = await createPost({
        variables: { input: values },
        update: (cache) => {
          cache.evict({ fieldName: "posts" });
        },
      });

      if (!response.errors) {
        router.push("/");
      }
    },
    []
  );

  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik initialValues={{ title: "", text: "" }} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form>
              <InputField name="title" placeholder="Title" label="Title" />

              <Box mt={4}>
                <InputField
                  name="text"
                  placeholder="Text"
                  label="Text"
                  type="text"
                  textArea
                />
              </Box>
              <Button
                mt={4}
                isLoading={isSubmitting}
                colorScheme="teal"
                type="submit"
              >
                Create Post
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(CreatePost);
