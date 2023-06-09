import React, { useState } from "react";
import axios from "axios";

export default function MainPage() {
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [data, setData] = useState("");
  const [inputPrivateKey, setInputPrivateKey] = useState("");
  const [signature, setSignature] = useState("");

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

  async function postSign(event) {
    event.preventDefault();
    await axios
      .post("http://localhost:5000/sign", {
        data: data,
        privateKey: inputPrivateKey,
      })
      .then((res) => {
        const getSignature = res.data.signature;
        console.log(getSignature);
        setSignature(getSignature);
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
    <div className="flex min-h-screen w-full flex-col bg-iwhite px-10 py-16">
      <div className="flex w-full pb-10 lg:pb-16">
        <span className="mx-auto text-4xl font-extrabold text-ipurple md:text-5xl lg:text-6xl">
          Sign-Qr
        </span>
      </div>

      {/* Generate Key */}
      <div className="mx-auto mb-24 flex w-fit flex-col gap-4 rounded-lg bg-igreen p-8 px-10 shadow-2xl sm:px-20 lg:gap-6 lg:px-28">
        <span className="mx-auto text-xl font-bold text-white lg:text-3xl">
          Generate Key
        </span>
        <div className="flex flex-col gap-y-5 lg:flex-row lg:gap-x-8">
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
          className="mx-auto w-fit rounded-lg bg-iyellow px-3 py-2 font-bold text-ipurple"
        >
          Generate
        </button>
      </div>

      {/* Generate Signature */}
      <form
        onSubmit={postSign}
        className="mx-auto mb-24 flex w-fit flex-col gap-4 rounded-lg bg-igreen p-8 px-10 shadow-2xl sm:px-20 lg:gap-6 lg:px-28"
      >
        <span className="mx-auto text-xl font-bold text-white lg:text-3xl">
          Generate Signature
        </span>
        {/* <input class="w-fit text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" /> */}
        <div className="flex flex-col gap-y-5 lg:flex-row lg:gap-x-8">
          <div className="flex flex-col gap-2 rounded-lg bg-white px-7 py-4 lg:px-12 lg:pb-8">
            <span className="mx-auto text-base font-bold text-ipurple lg:text-lg">
              Data
            </span>
            <textarea
              rows="6"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
              value={data}
              onChange={(event) => setData(event.target.value)}
              placeholder="Input your data (string)"
            />
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-white px-7 py-4 lg:px-12 lg:pb-8">
            <span className="mx-auto text-base font-bold text-ipurple lg:text-lg">
              Private Key
            </span>
            <textarea
              rows="6"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
              value={inputPrivateKey}
              onChange={(event) => setInputPrivateKey(event.target.value)}
              placeholder="Input your private key"
            />
          </div>
        </div>
        <div className="w-full px-10 lg:px-32">
          <div className="flex flex-col gap-2 rounded-lg bg-white px-7 py-4 lg:px-12">
            <span className="mx-auto text-base font-bold text-ipurple lg:text-lg">
              Signature
            </span>
            <textarea
              rows="2"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
              value={signature}
              readOnly
              placeholder="Signature will be generated here"
            />
            <button
              onClick={() => handleCopy(signature)}
              className="text-yellow mx-auto w-fit rounded-lg bg-igreen px-3 py-1 text-sm font-bold text-white"
            >
              Copy
            </button>
          </div>
        </div>
        <button
          className="mx-auto w-fit rounded-lg bg-iyellow px-3 py-2 font-bold text-ipurple"
          type="submit"
        >
          Generate
        </button>
      </form>

      {/* Verify  */}
      <div className="mx-auto flex w-fit flex-col gap-4 rounded-lg bg-igreen p-8 px-10 shadow-2xl sm:px-20 lg:gap-6 lg:px-28">
        <span className="mx-auto text-xl font-bold text-white lg:text-3xl">
          Verify
        </span>
        <div className="flex flex-col gap-y-5 lg:flex-row lg:gap-x-8">
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
