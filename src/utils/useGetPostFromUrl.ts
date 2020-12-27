import { usePostQuery } from "../generated/graphql";

const useGetPostFromUrl = (id: number) => {
  return usePostQuery({
    skip: id === -1,
    variables: { id },
  });
};

export default useGetPostFromUrl;
