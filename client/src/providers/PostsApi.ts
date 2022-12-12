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

export async function editPost(post: Record<string, any>): Promise<PostModel> {
  console.log('Mutation edit post');
  console.log(post);
  const postData = processPost(post);
  console.log(postData);
  const response = await fetch(`${baseUrl}/posts/${post.id}`, {
    method: 'PATCH',
    mode: 'cors',
    headers: {
      'Content-Accept': 'application/json'
    },
    credentials: 'include',
    body: postData,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`${response.status} ${data.exception.split(':').at(-1).trim().replace('>', '')}`);
  }

  return data;
}

function processPost(postValues: Record<string, any>): FormData {
  const requestData = new FormData();
  const fieldsToUpdate = ['title', 'body', 'status', 'images'];
    
  // Capture edit form data except file uploads
  for (const [key, value] of Object.entries(postValues)) {
    if (key === 'images') { continue; }
    if (!fieldsToUpdate.includes(key)) { continue; }

    requestData.append(`post[${key}]`, value);
  }

  if (postValues['images']) {
    // Adds file blobs to form data
    for (let i = 0; i < postValues['images'].length; i++) {
      requestData.append('post[images][]', postValues['images'][i], postValues['images'][i].name);
    }
  } else {
    requestData.append('post[images][]', '');
  }

  return requestData;
}