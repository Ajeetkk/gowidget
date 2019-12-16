import { configure } from "@storybook/react";
import { addDecorator } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import { addParameters } from "@storybook/react";
import { DocsPage, DocsContainer } from "@storybook/addon-docs/blocks";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: ""
});

axiosInstance.interceptors.request.use(
  request => {
    request.headers.Authorization = localStorage.getItem("token");

    return request;
  },

  error => {
    return Promise.reject({ ...error });
  }
);

localStorage.setItem(
  "token",

  "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImY2MFJ6U3lQN21iRERIWlA4QVE2NzVxems4MENkM2hEa21OWHR3XzA0a2cifQ.eyJleHAiOjE1Njk5MjA4NzYsIm5iZiI6MTU2OTgzNDQ3NiwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9nb29yZy5iMmNsb2dpbi5jb20vNmQ5Y2FkMmYtN2UwYy00NWY2LThlNWQtNDI5NGE5ODZiZGIwL3YyLjAvIiwic3ViIjoiZWZlYzk1ZTUtNjg5Yi00YmVhLTkwZjMtYWYzZDQ3ZjE3YzcwIiwiYXVkIjoiMjQ1Y2ZkNDEtYzQwYi00NDI3LWE2YzMtNmMxNTViNzhjOGJkIiwiYWNyIjoiYjJjXzFhX3NpZ251cF9zaWduaW5fcWEiLCJub25jZSI6Ijk0Mjg3NDk0LWEyNTUtNDVkOS04ZTAxLWM5MzI0M2RiMDg2YyIsImlhdCI6MTU2OTgzNDQ3NiwiYXV0aF90aW1lIjoxNTY5ODM0NDc2LCJuYW1lIjoiSW52aXRlZCBVc2VyIDEiLCJlbWFpbHMiOlsiaW52aTFAYnlvbS5kZSJdLCJnaXZlbl9uYW1lIjoiSW52aXRlZCIsImZhbWlseV9uYW1lIjoiVXNlciAxIiwicm9sZXMiOlsiSGl2ZUFkbWluIl0sInBlcm1pc3Npb25zIjpbXSwiaXNBY3RpdmUiOnRydWUsImlzQXBwcm92ZWQiOnRydWUsInJlZ2lzdHJhdGlvbkRhdGVUaW1lIjoiNy8yOS8yMDE5IDEwOjM5OjM5IEFNIn0.HM2NDUX7Op_vIReRU2J1OBHbQJmAdJlYAMoQPuKg7piL4_lTDtsTy9P4VHJlUiECsSSh9MBLCWv8UTEeYbtWT7dQdgGkVb30Eb7sD7EGgkHnWlJ5wSdEg5FHzj_et-WUBvubxRjB4uBjflnq2CX3LWutShT7xmi5AsgW5kR8hlmYnQM9nohUY8wir2wf0hCdNI_214JlYdMAZ2llHynrvaGUCgbHsXf8vfXr89X9-_EBXhUP6iqVpLkq4vIa9OGBpCwUNrTwdTiFsuzc7IJpGzIHXliSeXi4_vMdx2FcqvSpTiR0Oq5tWLlHGawDzwmSaienkTt6vO3V2HSKch-Dig"
);

addParameters({
  docs: {
    container: DocsContainer,

    page: DocsPage
  }
});

addDecorator(withInfo);

// automatically import all files ending in *.stories.js

configure(require.context("../src/stories", true, /\.stories\.js$/), module);
