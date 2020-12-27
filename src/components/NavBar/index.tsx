import React from "react";
import { Box, Flex, Link, Button, Heading } from "@chakra-ui/react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../../generated/graphql";
import { isServer } from "../../utils/isServer";
import { useApolloClient } from "@apollo/client";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = ({}) => {
  const apolloClient = useApolloClient();

  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });

  let body = null;

  if (loading) {
    // Data is Loading
  } else if (!data?.me) {
    // User is not Logged In
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={2}>
            Login
          </Link>
        </NextLink>

        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
  } else {
    // User is Logged In
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={2} fontWeight="bold" color="black">
            Create Post
          </Button>
        </NextLink>

        <Box ml={4}>{data.me.username}</Box>
        <Button
          type="button"
          variant="link"
          ml={4}
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          isLoading={logoutLoading}
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex bg="tomato" align="center" p={4}>
      <Flex margin="auto" flex={1} align="center" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading color="white">LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
