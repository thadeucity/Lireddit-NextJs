import { Box, Button, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import InputField from "../../../components/InputField";
import NavBar from "../../../components/NavBar";
import Wrapper from "../../../components/Wrapper";
import { useUpdatePostMutation } from "../../../generated/graphql";
import useGetIntId from "../../../utils/useGetIntId";
import useGetPostFromUrl from "../../../utils/useGetPostFromUrl";
import { withApollo } from "../../../utils/withApollo";

const EditPost: React.FC = ({}) => {
  const router = useRouter();

  const postId = useGetIntId();
  const { data, loading } = useGetPostFromUrl(postId);

  const [updatePost] = useUpdatePostMutation();

  const handleSubmit = useCallback(
    async (values: { title: string; text: string }) => {
      await updatePost({ variables: { id: postId, ...values } });
      router.back();
    },
    []
  );

  if (loading) {
    <>
      <NavBar />
      <Wrapper variant="small">...Loading</Wrapper>
    </>;
  }

  if (!data?.post) {
    return (
      <>
        <NavBar />
        <Wrapper variant="regular">
          <Heading>404: Post Not Found</Heading>
        </Wrapper>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <Wrapper variant="small">
        <Formik
          initialValues={{ title: data.post.title, text: data.post.text }}
          onSubmit={handleSubmit}
        >
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
                Update Post
              </Button>
            </Form>
          )}
        </Formik>
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: false })(EditPost);
