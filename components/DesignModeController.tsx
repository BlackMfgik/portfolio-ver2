"use client";

import { useState } from "react";
import AsciiBackground from "@/components/AsciiBackground";
import Nav from "@/components/Nav";

export default function DesignModeController() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [trackCoverSrc, setTrackCoverSrc] = useState("/ascii-track-cover.png");

  return (
    <>
      <AsciiBackground
        isMusicPlaying={isMusicPlaying}
        coverImageSrc={trackCoverSrc}
      />
      <Nav
        isMusicPlaying={isMusicPlaying}
        onMusicPlayingChange={setIsMusicPlaying}
        onTrackCoverChange={setTrackCoverSrc}
      />
    </>
  );
}
