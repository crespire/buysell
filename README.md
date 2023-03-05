# Buy & Sell By Crespire

A toy marketplace application implemented using a Rails 7 application in API
mode and a React application written in Typescript. This application includes:
* User registration and authentication. The Rails authentication is powered by
  Rodauth and the `rodauth-rails` gem.
* File uploading
* Full test suite covering both the API application and the React application
  powered by Rspec and Cypress.

You can find a live link in the about section.

# Key Learning
Rails provides a lot of magic! I was actually amazed that something as simple
as file uploading was quite magical when you're sticking with the full Rails
stack. Figuring out how to add, remove and update images on a Rails model by
way of a React application was interesting and good learning for more deeply
understanding what was happening at the request cycle level.

This application is quite a bit less complicated than my previous large toy
application ([Railsbook](https://railsbook.crespire.dev)), but it felt big
because of all the work I had to do to replicate behaviour that came "for free"
with Rails.

I was really pleased with using Tailwind for this project, but found it hard to
come up with a design system to hang my ideas on. This was a problem I also
struggled with on my previous project, but this time I leaned into using a
solution that really worked for me. DaisyUI, based on Tailwind, was excellent
and helped me take this project across the finish line. I think without using
a component library like DaisyUI, I would have spent quite a bit longer trying
to figure out the styling and presentation of the application.

# Deployment Notes
This project is deployed from a monorepo, but getting it running was pretty
straight-forward. The frontend is hosted on Vercel with the root directory
set to `client/` and the backend is deployed to a self-hosted dokku via the
`subtree` git command so that dokku can figure out how to build the Rails
application automatically via buildpack detection. As this application doesn't
have any assets, there was no need to worry about `vips` (unlike Railsbook).

# Future Opportunities
In the interest of moving on with my planned course of projects, I did leave
a number of improvements on the table to be considered and implemented at a
later date. Some of these ideas include:
* Consolidate the Post API provider to utilize React Query. React Query is such
  a lovely library and the idea behind it really resonated with me. By the time
  I had looked into it, I'd already written half of my Post API provider on the
  React application, and I didn't have the appetite to re-write the API provider
  from scratch.
* Post search. I had planned this feature but realized that I would be blocked
  by my decision to not fully move the Post API to React Query. Moving the API
  to React Query fully would allow me to easily filter posts for a search.
* User messaging. Currently, there are Posts with images and that's about it.
  A more fully featured application would have a way for users to reach out to
  each other, and while this was something I had originally planned, implementing
  this feature feels like I'd just be doing more React. I may add this at a later
  date, but I felt it more important to move on to my next planned project.

# About Me
You can learn more about my projects and [learn more about me at my portfolio](https://crespire.dev).
