import React from "react";
import PostCreate from "./ui/PostCreate";
import PostList from "./ui/PostList";
     
const App = () => {
  return (
  <div className="container">
    <h1>Create Post (Woohoo!)</h1>
    <PostCreate/>
    <hr/>
    <PostList/>
  </div>
  );
};
 
export default App;