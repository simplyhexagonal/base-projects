import { M as Menu, F as Footer } from "./index.js";
import { r as react, R as React, a as ReactDOM } from "./vendor.js";
var app_component = "";
const App = ({
  children
}) => {
  const [count, setCount] = react.exports.useState(0);
  return /* @__PURE__ */ React.createElement("div", {
    className: "App"
  }, children, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("button", {
    type: "button",
    onClick: () => setCount((count2) => count2 + 1)
  }, "count is: ", count)));
};
var index = "";
const HomePage = () => {
  return /* @__PURE__ */ React.createElement(App, null, /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", null, "Hello World!"), /* @__PURE__ */ React.createElement("p", null, "Almost before we knew it, we had left the ground.")));
};
ReactDOM.render(/* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(Menu, null)), document.getElementById("header"));
ReactDOM.render(/* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(HomePage, null)), document.getElementById("app"));
ReactDOM.render(/* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(Footer, null)), document.getElementById("footer"));
