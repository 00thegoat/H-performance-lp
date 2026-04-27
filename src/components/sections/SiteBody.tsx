"use client";

import parse from "html-react-parser";
import html from "@/snapshot/body";

export default function SiteBody() {
  return <>{parse(html)}</>;
}
