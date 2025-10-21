import React from "react";
import "./static.css";
import StaticHeader from "./StaticHeader";

export default function Contact() {
  return (
    <>
      <StaticHeader />
      <main className="static-page">
      <h1>Contact</h1>
      <p>
        Have questions or feedback? Reach us at:
      </p>
      <ul>
        <li>Email: support@filmhub.example</li>
        <li>Twitter: @filmhub</li>
      </ul>
      <p>
        We typically reply within 2 business days.
      </p>
      </main>
    </>
  );
}
