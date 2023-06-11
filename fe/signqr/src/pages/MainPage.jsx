import React from "react";
import GenerateKey from "../components/GenerateKey";
import GenerateSign from "../components/GenerateSign";

export default function MainPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-iwhite px-10 py-16">
      <div className="flex w-full pb-10 lg:pb-16">
        <span className="mx-auto text-4xl font-extrabold text-ipurple md:text-5xl lg:text-6xl">
          Sign-Qr
        </span>
      </div>
      <GenerateKey />
      <GenerateSign />
    </div>
  );
}
