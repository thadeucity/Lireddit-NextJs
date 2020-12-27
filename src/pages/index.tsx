import React, { useCallback } from "react";
import NavBar from "../components/NavBar";

import NextLink from "next/link";

import { usePostsQuery } from "../generated/graphql";

import Wrapper from "../components/Wrapper";

import {
  Box,
  Heading,
  Stack,
  Text,
  Flex,
  Link,
  Button,
} from "@chakra-ui/react";
import UpdootSection from "../components/UpdootSection";
import EditDeletePostButtons from "../components/EditDeletePostButtons";
import { withApollo } from "../utils/withApollo";

const Index: React.FC = ({}) => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  const handleLoadMore = useCallback(() => {
    if (!data || !data.posts.hasMore) return;

    fetchMore({
      variables: {
        limit: variables?.limit,
        cursor: data.posts.posts[data.posts.posts.length - 1].created_at,
      },
    });
  }, [data]);

  if (!loading && !data) {
    return (
      <div>
        <NavBar />
        <Wrapper variant="regular">
          <br />
          <Flex align="center">
            <Heading>LiReddit</Heading>
            <NextLink href="/create-post">
              <Link ml="auto">Create Post</Link>
            </NextLink>
          </Flex>
          <br />
          <Text>Error 500</Text>
        </Wrapper>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Wrapper variant="regular">
        <br />
        {data && (
          <Stack spacing={8}>
            {data.posts.posts.map(
              (post) =>
                post && (
                  <Flex p={5} shadow="md" borderWidth="1px" key={post.id}>
                    <UpdootSection post={post} />
                    <Box ml="4" flex="1">
                      <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                        <Heading fontSize="xl" cursor="pointer">
                          {post.title}
                        </Heading>
                      </NextLink>
                      <Text>posted by: {post.creator.username}</Text>
                      <Flex w="100%" align="center">
                        <Text flex="1" mt={4}>
                          {post.textSnippet.slice(0, 50)}...
                        </Text>
                        <EditDeletePostButtons
                          postId={post.id}
                          creatorId={post.creator.id}
                        />
                      </Flex>
                    </Box>
                  </Flex>
                )
            )}
          </Stack>
        )}

        {data && data.posts.hasMore && (
          <Flex justifyContent="center">
            <Button onClick={handleLoadMore} isLoading={loading} my={8}>
              load more
            </Button>
          </Flex>
        )}
      </Wrapper>
    </div>
  );
};

export default withApollo({ ssr: true })(Index);
