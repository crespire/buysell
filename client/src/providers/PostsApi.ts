import { baseUrl } from "..";
import { PostModel } from "../@types/post";

export async function fetchPosts(): Promise<PostModel[]> {
  const response = await fetch(`${baseUrl}/posts`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`${response.status} ${data.exception.split(':').at(-1).trim().replace('>', '')}`);
  }

  return data;
};

export async function getPost(id?: string): Promise<PostModel> {
  const response = await fetch(`${baseUrl}/posts/${id}`, {
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`${response.status} ${data.exception.split(':').at(-1).trim().replace('>', '')}`);
  }

  return data;
};

export async function deletePost(id: string): Promise<void> {
  const response = await fetch(`${baseUrl}/posts/${id}`, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error(`${response.statusText} ${response.text}`);
  }
}