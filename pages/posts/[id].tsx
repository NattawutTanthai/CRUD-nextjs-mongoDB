import React, { useState } from "react";
import type { GetStaticPropsContext, GetStaticPropsResult } from "next";
import Layout from "../../components/Layout";

type PageParams = {
  id: string;
};

type ContentPageProps = {
  post: Post;
};

type Post = {
  _id: string;
  title: string;
  content: string;
};

type ResponseFromServer = {
  _id: string;
  title: string;
  content: string;
};

export async function getStaticProps({
  params,
}: GetStaticPropsContext<PageParams>): Promise<
  GetStaticPropsResult<ContentPageProps>
> {
  try {
    let response = await fetch(
      "http://localhost:3000/api/getpost?id=" + params?.id
    );
    let responseFromServer: ResponseFromServer = await response.json();
    return {
      props: {
        post: {
          _id: responseFromServer._id,
          title: responseFromServer.title,
          content: responseFromServer.content,
        },
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        post: {
          _id: "",
          title: "",
          content: "",
        },
      },
    };
  }
}

export async function getStaticPaths() {
  let posts = await fetch("http://localhost:3000/api/getposts");

  let postFromServer: [Post] = await posts.json();

  return {
    paths: postFromServer.map((post) => {
      return {
        params: {
          id: post._id,
        },
      };
    }),
    fallback: false,
  };
}

function EditPost({ post: { _id, title, content } }: ContentPageProps) {
  const [postTitle, setPostTitle] = useState(title);
  const [postContent, setPostContent] = useState(content);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (postTitle && postContent) {
      try {
        let response = await fetch(
          "http://localhost:3000/api/editpost?id=" + _id,
          {
            method: "POST",
            body: JSON.stringify({
              title: postTitle,
              content: postContent,
            }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json,text/plain,*/*",
            },
          }
        );
        response = await response.json();
        setPostTitle("");
        setPostContent("");
        setError("");
        setMessage("Post updated successfully");
      } catch (error: any) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Layout>
        <form className="form" onSubmit={handleSubmit}>
          {error ? <div className="alert-error">{error}</div> : null}
          {message ? <div className="alert-message">{message}</div> : null}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              name="title"
              type="text"
              placeholder="Title of the post"
              onChange={(e) => setPostTitle(e.target.value)}
              value={postTitle ? postTitle : "no value"}
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              name="content"
              placeholder="Content of the post"
              cols={20}
              rows={8}
              onChange={(e) => setPostContent(e.target.value)}
              value={postContent ? postContent : "no value"}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="submit_btn">
              Update
            </button>
          </div>
        </form>
        <style jsx>
          {`
            .form {
              width: 400px;
              margin: 10px auto;
            }

            .form-group {
              width: 100%;
              margin-bottom: 10px;
              display: block;
            }

            .form-group label {
              display: block;
              margin-bottom: 10px;
            }

            .form-group input[type="text"],
            .form-group textarea {
              padding: 10px;
              width: 100%;
            }

            .alert-error {
              width: 100%;
              color: red;
              margin-bottom: 10px;
            }

            .alert-message {
              width: 100%;
              color: green;
              margin-bottom: 10px;
            }
          `}
        </style>
      </Layout>
    </div>
  );
}

export default EditPost;
