import { R as React } from "./vendor.js";
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var global = "";
var menu_component = "";
const lang = "en";
const Menu = () => {
  location.pathname.replace(/^\/[^\/]+?\//, "");
  return /* @__PURE__ */ React.createElement("div", {
    className: "menu"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "logo"
  }, /* @__PURE__ */ React.createElement("a", {
    href: `/${lang}/`
  }, /* @__PURE__ */ React.createElement("img", {
    src: "/logo.svg",
    className: "App-logo",
    alt: "logo",
    width: "80"
  }))), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", {
    href: `/${lang}/`
  }, "Home")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", {
    href: `/${lang}/about/`
  }, "About"))));
};
var footer_component = "";
const Footer = () => {
  const currentPath = location.pathname.replace(/^\/[^\/]+?\//, "");
  return /* @__PURE__ */ React.createElement("div", {
    className: "footer"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "lang-selector"
  }, "\u{1F310} ", /* @__PURE__ */ React.createElement("a", {
    href: `/en/${currentPath}`
  }, "EN"), " | ", /* @__PURE__ */ React.createElement("a", {
    href: `/es/${currentPath}`
  }, "ES")), "Copyright \xA9 ", new Date().getFullYear());
};
export { Footer as F, Menu as M };
