"use client";

import { useEffect } from "react";

type Props = {
  path: string;
};

export default function RedirectTo({ path }: Props) {
  useEffect(() => {
    window.location.replace(path);
  }, [path]);
  return null;
}
