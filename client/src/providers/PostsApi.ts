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
  const postData = processPost(post);
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
  const fieldsToUpdate = ['title', 'body', 'status'];
    
  // Capture edit form data except file uploads
  for (const [key, value] of Object.entries(postValues)) {
    if (!fieldsToUpdate.includes(key)) { continue; }

    requestData.append(`post[${key}]`, value);
  }

  if (postValues['images_to_add']) {
    // Adds file blobs to form data
    for (let i = 0; i < postValues['images_to_add'].length; i++) {
      requestData.append('post[images][]', postValues['images_to_add'][i], postValues['images_to_add'][i].name);
    }
  } else {
    requestData.append('post[images][]', '');
  }

  if (postValues['images_to_purge']) {
    postValues['images_to_purge'].forEach((name: string) => {
      requestData.append('post[images_to_purge][]', name);
    })
    
  } else {
    requestData.append('post[images_to_purge][]', '');
  }

  return requestData;
}