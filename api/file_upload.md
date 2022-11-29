* Set Up Active Storage
* Adjust React Post form submit to leverage `FormData`
* Send completed FormData object to backend.

```js
// This replicates current state into a FormData object
let formData = new FormData();
for (const [key, value] of Object.entries(values)) {
  formData.append(key, value);
}

// This posts the FormData object
fetch('api/endpoint',
  {
    body: formData,
    method: 'post',
    credentials: 'include',
  }
)
```

This will send as `multipart/form-data` and it should be picked up by the PostsController without much fuss.