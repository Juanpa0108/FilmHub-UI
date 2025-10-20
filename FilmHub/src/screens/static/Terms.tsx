import React from "react";
import "./static.css";
import StaticHeader from "./StaticHeader";

export default function Terms() {
  return (
    <>
      <StaticHeader />
      <main className="static-page">
      <h1>Terms of Use</h1>
      <p>
        By accessing FilmHub, you agree to the following terms:
      </p>
      <ul>
        <li>Use FilmHub in compliance with applicable laws.</li>
        <li>Respect intellectual property and the community guidelines.</li>
        <li>Content and data may change without prior notice.</li>
      </ul>
      <p>
        These terms are provided for demonstration purposes.
      </p>
      </main>
    </>
  );
}
