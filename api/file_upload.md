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


Caveats for next time:
* <form> element must be `encType="multipart/form-data"` as this will make sure files can be sent.
* `FormData` can be appended with multiple files, but you must do so in a loop. This ensures that you are appending `Blob` data types, rather than an object. Each individual file must be a `Blob` (or its subtype `File`). The field name simply has to end in `[]` to indicate it is an array on the backend side.

I suspect in reality, your FormData looks something like this:
```
{
  post[files][]: <FileBlob1>,
  post[files][]: <FileBlob2>
}
```