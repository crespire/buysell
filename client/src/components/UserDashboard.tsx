import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Post from "./Post";
import { useQuery } from "@tanstack/react-query";
import { fetchUserPosts } from "../providers/PostsApi";
import { PostModel } from "../@types/post";

function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['posts', 'dashboard'],
    queryFn: fetchUserPosts,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [])

  if (isLoading) return <p>Loading...</p>;
  if (isError && error instanceof Error) return <p>Error: {error.message} </p>;

  return (
    <div className="container flex flex-col justify-center content-center gap-y-3 bg-base-100">
      { user && user.status === 1 && <p className="verify alert alert-warning">Please confirm your account by checking your email and clicking the link!</p> }
      <h1 className="text-5xl">Your Posts</h1>
      <section>
        { data?.map((post: PostModel) => {
          return <Post key={post.id} post={post} />
        })}
      </section>
    </div>
  );
}

export default UserDashboard;
