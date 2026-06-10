import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";

console.load = function (url, height = 100, width = null) {
  return new Promise((resolve) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        if (blob.type.indexOf("image") !== 0) {
          console.warn("Valid image not found.");
          return resolve(false);
        }
        if (blob.size > 8192 && navigator.userAgent.indexOf("Firefox") > 0) {
          console.warn("Image size too big to be displayed in Firefox.");
          return resolve(false);
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result;
          const image = new Image();

          image.onload = function () {
            const finalHeight = height || image.naturalHeight;
            const finalWidth =
              width || (finalHeight * image.naturalWidth) / image.naturalHeight;

            const style = [
              "display: inline-block;",
              "font-size: 0px;",
              "line-height: 0px;",
              "color: transparent;",
              `padding: ${finalHeight / 2}px ${finalWidth / 2}px;`,
              `background: url(${dataUrl}) no-repeat;`,
              "background-size: contain;",
            ].join(" ");

            console.log("%c ", style);
            resolve(true);
          };

          image.onerror = () => resolve(false);
          image.src = dataUrl;
        };
        reader.readAsDataURL(blob);
      })
      .catch((e) => {
        if (e && e.message) console.warn(e.message);
        resolve(false);
      });
  });
};

console
  .load("https://avatars.githubusercontent.com/u/210909823?v=4", 80)
  .then(() => {
    console.log(
      "%c > ./matthew --version",
      "color: #8b5cf6; font-size: 14px; font-weight: bold;",
    );
    console.log(
      "%c v1.0 — developer from tallinn",
      "color: #52525b; font-size: 11px;",
    );
  });

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);