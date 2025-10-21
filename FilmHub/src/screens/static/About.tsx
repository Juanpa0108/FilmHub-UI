import React from "react";
import "./static.css";
import StaticHeader from "./StaticHeader";

export default function About() {
  return (
    <>
      <StaticHeader />
      <main className="static-page">
      <h1>About FilmHub</h1>
      <p>
        FilmHub is a community for discovering, reviewing, and enjoying movies. 
        Browse premieres, explore categories, and keep track of your favorites.
      </p>
      <p>
        Our mission is to make movie discovery delightful with a clean interface, 
        smart recommendations, and a friendly community.
      </p>
      </main>
    </>
  );
}
