# File Uploads from React
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

This was the reference article I used for uploading files from React to Rails API: https://medium.com/swlh/react-file-uploads-to-rails-cc9c62e95a9d

After some trouble and sorting it out, I discovered a few caveats for next time:
1. The `<form>` element must be `encType="multipart/form-data"` as this will make sure files can be sent.
1. `FormData` can be appended with multiple files, but you must do so in a loop. This ensures that you are appending `Blob`/`File` (child type of `Blob`) data types, rather than an object (object gets serialized as a string!). The field name simply has to end in `[]` to indicate it is an array on the backend side. I suspect in reality, FormData looks something like this:
  ```
  {
    post[files][]: <FileBlob1>,
    post[files][]: <FileBlob2>
  }
  ````
1. `ActiveSupport::MessageVerifier::InvalidSignature` was the error I was getting on the controller side when uploading. This typically signals that data from the frontend has been serialized as a string, which is no good. In fact, examining my request, I was seeing that my file input was sending the string `[object FileList]` which meant I wasn't appending the files properly to the `FormData` object.

# Displaying Uploaded Files
I've got the file uploading working, but I am currently struggling with how to retrieve the blob paths to display.

There are some file serializer options out there, but those seem to target Rails ~3/4, which is many major versions behind. The file serializer gem is currently under a re-write?

I am able to get the paths for the files, which is what my frontend application needs, but I am unsure how to include them in the JSON response.

The next day...
All I literally had to do was merge the data into the object as JSON:  
`resource.as_json.merge({ new_data: resource.method_for_data })`

A few days later, however, and I realized I wasn't actually displaying the images on the frontend yet, so I tried to do that. I was struggling with _some_ images being sent as an octet-stream type, which meant they were not working in `<img>` tags, but could be downloaded. After a frustrating few hours, it turns out that the problem is specific to how Rails treats `image/svg+xml` as a binary type, which meant it was sending an `octet-stream` type when requesting SVGs. The solution is that we should disallow SVG as an upload type, as it can make the add vulnerable to XSS attacks due to embedded XML potentially being a problem.
