"use client";

import { useCallback, useEffect, useState } from "react";
import AsciiBackground from "@/components/AsciiBackground";
import Nav from "@/components/Nav";

const STORAGE_KEY = "portfolio-red-face-mode";

export default function DesignModeController() {
  const [faceMode, setFaceMode] = useState(false);
  const [preferenceReady, setPreferenceReady] = useState(false);

  useEffect(() => {
    setFaceMode(window.localStorage.getItem(STORAGE_KEY) === "on");
    setPreferenceReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.designMode = faceMode
      ? "red-face"
      : "default";

    if (preferenceReady) {
      window.localStorage.setItem(STORAGE_KEY, faceMode ? "on" : "off");
    }

    return () => {
      delete document.documentElement.dataset.designMode;
    };
  }, [faceMode, preferenceReady]);

  const toggleFaceMode = useCallback(() => {
    setFaceMode((value) => !value);
  }, []);

  return (
    <>
      <AsciiBackground faceMode={faceMode} />
      <Nav faceMode={faceMode} onToggleFaceMode={toggleFaceMode} />
    </>
  );
}
