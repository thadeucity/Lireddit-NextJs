import { Box, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDeletePostMutation, useMeQuery } from "../../generated/graphql";

interface EditDeletePostButtonsProps {
  postId: number;
  creatorId?: number;
}

const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  postId,
  creatorId,
}) => {
  const { data: meData } = useMeQuery();
  const [deletePost] = useDeletePostMutation();

  if (creatorId !== meData?.me?.id) {
    return null;
  }

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
        <IconButton
          mr={4}
          as={Link}
          icon={<FiEdit />}
          colorScheme="gray"
          aria-label="Edit Post"
        />
      </NextLink>
      <IconButton
        icon={<FiTrash2 />}
        colorScheme="gray"
        aria-label="Delete Post"
        onClick={() =>
          deletePost({
            variables: { id: postId },
            update: (cache) => {
              cache.evict({ id: "Post:" + postId });
            },
          })
        }
      />
    </Box>
  );
};

export default EditDeletePostButtons;
