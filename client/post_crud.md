Create, read complete.

# Delete
The trouble I'm running into here is not so much deleting the post, but the larger problem of keeping the frontend in sync with the backend.

At core, delete just needs to send the message to the backend, make sure there's a 200, then either refresh the resources in local state or update local state to reflect the action taken (delete, in this case).

The problem comes when you have more than one client. Some other user can dispatch a create action, for example, that isn't reflected on the current user unless the React client refetches.

How do I know when to refresh? What about posts that are draft and not yet published? Should the frontend get all the data and render accordingly? Or should the frontend only get data that it should be able to view?

So, the challenges are:
1) How do we keep frontend data in sync with backend data?
2) How should we handle resources that exist in the backend, but that our current user is not authorized to view?
3) Should the frontend store all resources its authorized to view in one place, then query that for rendering?


Some thoughts:
1) It may be time to look into Redux or some other state management library. I think this would be a good opportunity for it.

2) Keeping the store sync'd with the backend might be a little easier. Possible to build a scoped index to pull all the resources that the user can access. This might involve some scoping on the Rails side as well.

3) Could either a) poll the backend periodically, OR b) pubsub it with a websocket.
