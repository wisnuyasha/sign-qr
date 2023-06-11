import React, { useState } from "react";
import axios from "axios";

export default function GenerateKey() {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [isGeneratedKey, setIsGeneratedKey] = useState(false);

  async function getKey() {
    await axios
      .get("http://localhost:5000/KeyGen")
      .then((res) => {
        const privateKey = res.data.privateKey;
        const publicKey = res.data.publicKey;
        setPrivateKey(privateKey);
        setPublicKey(publicKey);
        setIsGeneratedKey(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCopy(text) {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  return (
    <div className="mx-auto mb-24 flex w-fit flex-col rounded-lg bg-igreen p-8 px-10 shadow-2xl sm:px-20  lg:px-28">
      <span className="mx-auto mb-6 text-xl font-bold text-white lg:text-3xl">
        Generate Key
      </span>
      <div className="mb-6 flex flex-col gap-y-5 lg:flex-row lg:gap-x-8">
        <div className="flex flex-col gap-2 rounded-lg bg-white px-7 py-4 lg:px-12">
          <span className="mx-auto text-base font-bold text-ipurple lg:text-lg">
            Public Key
          </span>
          <textarea
            rows="6"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
            value={publicKey}
            readOnly
            placeholder="Public key will be generated here"
          />
          <button
            onClick={() => handleCopy(publicKey)}
            className="text-yellow mx-auto w-fit rounded-lg bg-igreen px-3 py-1 text-sm font-bold text-white"
          >
            Copy
          </button>
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-white px-7 py-4 lg:px-12">
          <span className="mx-auto text-base font-bold text-ipurple lg:text-lg">
            Private Key
          </span>
          <textarea
            rows="6"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
            value={privateKey}
            readOnly
            placeholder="Public key will be generated here"
          />
          <button
            onClick={() => handleCopy(privateKey)}
            className="text-yellow mx-auto w-fit rounded-lg bg-igreen px-3 py-1 text-sm font-bold text-white"
          >
            Copy
          </button>
        </div>
      </div>
      <button
        onClick={() => getKey()}
        className="mx-auto mb-3 w-fit rounded-lg bg-iyellow px-3 py-2 font-bold text-ipurple"
      >
        Generate
      </button>
      {isGeneratedKey ? (
        <div className=" mx-auto w-fit rounded-xl border-2 border-iyellow px-3 py-[0.2rem]">
          <p className=" font-semibold text-white">
            Public key & Private key generated !!
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
