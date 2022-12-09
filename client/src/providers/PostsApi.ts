import { baseUrl } from "..";
import { PostModel } from "../@types/post";

export async function fetchPosts(): Promise<PostModel[] | Record<string, any>> {
  return await fetch(`${baseUrl}/posts`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
  .then((response) => response.json())
  .catch((err) => {
    console.log(err);
    return {"error": err};
  });
};

export async function getPost(id?: string): Promise<PostModel | Record<string, any>> {
  return await fetch(`${baseUrl}/posts/${id}`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
  .then((response) => response.json())
  .catch((err) => {
    console.log(err);
    return {"error": err};
  });
}