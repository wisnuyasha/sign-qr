import React, { useState } from "react";
import axios from "axios";

export default function MainPage() {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [data, setData] = useState("");
  const [inputPrivateKey, setInputPrivateKey] = useState("")

  async function getKey() {
    await axios
      .get("http://localhost:5000/KeyGen")
      .then((res) => {
        const privateKey = res.data.privateKey;
        const publicKey = res.data.publicKey;
        setPrivateKey(privateKey);
        setPublicKey(publicKey);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function postSign() {
    axios.post('/sign', {
        data: data,
        privateKey: inputPrivateKey
    })
  }

  function handleCopy(text) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-iwhite px-10">
      <div className="flex w-full py-10 lg:py-16">
        <span className="mx-auto text-4xl font-extrabold text-ipurple lg:text-5xl">
          Sign-Qr
        </span>
      </div>
      <div className="mx-auto flex w-fit flex-col gap-4 rounded-lg bg-igreen p-8 px-10 shadow-2xl sm:px-20 lg:gap-6 lg:px-28">
        <span className="mx-auto text-xl font-bold text-white lg:text-2xl">
          Generate Key
        </span>
        <div className="flex flex-col gap-y-5 lg:flex-row lg:gap-x-8">
          <div className="flex flex-col gap-2 rounded-lg bg-white px-7 py-4 lg:px-12">
            <span className="mx-auto text-base font-bold text-ipurple lg:text-lg">
              Public Key
            </span>
            <textarea
              id="message"
              rows="6"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
              value={publicKey}
              readOnly
              placeholder="Public key will be generated here"
            ></textarea>
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
              id="message"
              rows="6"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
              value={privateKey}
              readOnly
              placeholder="Public key will be generated here"
            ></textarea>
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
          className="mx-auto w-fit rounded-lg bg-iyellow px-3 py-2 font-bold text-ipurple"
        >
          Generate
        </button>
      </div>
    </div>
  );
}
