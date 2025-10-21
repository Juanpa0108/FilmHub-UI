import React from "react";
import "./static.css";
import StaticHeader from "./StaticHeader";

export default function Privacy() {
  return (
    <>
      <StaticHeader />
      <main className="static-page">
      <h1>Privacy Policy</h1>
      <p>
        We value your privacy. FilmHub collects minimal data to operate the service.
      </p>
      <ul>
        <li>We store account data you provide to sign in.</li>
        <li>We use analytics to improve the product.</li>
        <li>We do not sell your personal information.</li>
      </ul>
      <p>
        This is a sample policy for demonstration.
      </p>
      </main>
    </>
  );
}
