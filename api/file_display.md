I've got the file uploading working, but I am currently struggling with how to retrieve the blob paths to display.

There are some file serializer options out there, but those seem to target Rails ~3/4, which is many major versions behind. The file serializer gem is currently under a re-write?

I am able to get the paths for the files, which is what my frontend application needs, but I am unsure how to include them in the JSON response.