import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Post from "./Post";
import { useQuery } from "@tanstack/react-query";
import { fetchUserPosts } from "../providers/PostsApi";
import { PostModel } from "../@types/post";
import { Link } from "react-router-dom";

function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['posts'],
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
    <div>
      <Link to="/account">Edit Account</Link>
      <h1 className="text-2xl">Your Posts</h1>
      <section>
        { data?.map((post: PostModel) => {
          return <Post key={post.id} post={post} />
        })}
      </section>
    </div>
  );
}

export default UserDashboard;
