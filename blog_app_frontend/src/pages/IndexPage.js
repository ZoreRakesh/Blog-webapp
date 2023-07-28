import Post from "../Post";
import {useEffect, useState} from "react";

export default function IndexPage() {
  const [posts,setPosts] = useState([]);
  useEffect(() => {
    fetch('http://localhost:4000/post').then(response => {
      response.json().then(posts => {
        setPosts(posts);
      });
    });
  }, []);

  
  return (
    <>
    <section className="mx-14 mt-5 lg:mx-40">
      <h1 className="mb-10 font-bold text-4xl ">THE BLOG</h1>
    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-3 ">
      {posts.length > 0 && posts.map(post => (
        <Post {...post} />
      ))}
      
      </div>
      </section>
    </>
  );
}