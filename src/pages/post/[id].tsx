import React from "react";
import NavBar from "../../components/NavBar";
import Wrapper from "../../components/Wrapper";

import { Box, Heading, Text } from "@chakra-ui/react";
import useGetPostFromUrl from "../../utils/useGetPostFromUrl";
import useGetIntId from "../../utils/useGetIntId";
import EditDeletePostButtons from "../../components/EditDeletePostButtons";
import { withApollo } from "../../utils/withApollo";

const Post: React.FC = ({}) => {
  const postId = useGetIntId();
  const { data, loading } = useGetPostFromUrl(postId);

  if (!data?.post && !loading) {
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
      <Wrapper variant="regular">
        {loading ? (
          <>
            <h1>LOADING...</h1>
          </>
        ) : (
          <>
            <Heading>{data?.post?.title}</Heading>
            <Box mb={4}>
              <Text>{data?.post?.text}</Text>
            </Box>
            <EditDeletePostButtons
              postId={postId}
              creatorId={data?.post?.creator.id}
            />
          </>
        )}
      </Wrapper>
    </>
  );
};

export default withApollo({ ssr: true })(Post);
