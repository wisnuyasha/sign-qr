import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function VerifyPage() {
  const [docsFilename, setDocsFilename] = useState([]);
  const [signature, setSignature] = useState(null);
  const [inputPublicKey, setInputPublicKey] = useState(null);
  const [inputErr, setInputErr] = useState(false);
  const [verifErr, setVerifErr] = useState(false);
  const [verifSuccess, setVerifSuccess] = useState(false);
  const { id } = useParams();

  async function handleSubmit() {
    if (!inputPublicKey) {
      setInputErr(true);
      return;
    } else {
      const newObjectDocs = {
        fileName: docsFilename,
        publicKey: inputPublicKey,
        signature: signature,
      };
      await axios
        .post(`http://localhost:5000/verify`, newObjectDocs)
        .then((res) => {
          const data = res.data;
          console.log(data);
          if (data.verify === true) {
            window.open(data.fileURL);
            setVerifSuccess(true);
            setVerifErr(false)
          } else setVerifErr(true);
        })
        .catch((err) => {
          console.log(err);
          setVerifErr(true);
          setVerifSuccess(false);
        });
    }
  }

  useEffect(() => {
    async function getDataById() {
      await axios
        .get(`http://localhost:5000/documents/${id}`)
        .then((res) => {
          const filename = res.data.fileName;
          const signature = res.data.signature;
          setDocsFilename(filename);
          setSignature(signature);
        })
        .catch((err) => console.log(err));
    }
    getDataById();
  }, [id]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-iwhite px-10 py-16">
      <div className="mx-auto flex w-fit flex-col gap-4 rounded-lg bg-igreen p-8 px-10 shadow-2xl sm:px-20 lg:gap-6 lg:px-28">
        <span className="mx-auto text-xl font-bold text-white lg:text-3xl">
          {docsFilename}
        </span>
        <div className="flex flex-col gap-y-5 lg:flex-row lg:gap-x-8">
          <div className="flex flex-col gap-2 rounded-lg bg-white px-7 py-4 lg:px-12 lg:pb-6">
            <span className="mx-auto text-base font-bold text-ipurple lg:text-lg">
              Signature
            </span>
            <textarea
              rows="6"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
              readOnly
              value={signature}
              placeholder="Input your signature"
            ></textarea>
            {inputErr ? (
              <p className="mx-auto text-xs font-medium text-red-500">
                Dont forget to input ur signature / public key :)
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 rounded-lg bg-white px-7 py-4 lg:px-12 lg:pb-6">
            <span className="mx-auto text-base font-bold text-ipurple lg:text-lg">
              Public Key
            </span>
            <textarea
              rows="6"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
              onChange={(event) => setInputPublicKey(event.target.value)}
              placeholder="Input your public key"
            ></textarea>
            {inputErr ? (
              <p className="mx-auto text-xs font-medium text-red-500">
                Dont forget to input ur signature / public key :)
              </p>
            ) : null}
          </div>
        </div>
        <button
          onClick={() => handleSubmit()}
          className="mx-auto w-fit rounded-lg bg-iyellow px-3 py-2 font-bold text-ipurple"
          type="button"
        >
          Submit
        </button>
        {verifSuccess ? (
          <div className=" mx-auto w-fit rounded-xl border-2 border-iyellow px-3 py-[0.2rem]">
            <p className=" font-semibold text-white">
              Verified & Downloaded !!
            </p>
          </div>
        ) : null}
        {verifErr ? (
          <div className=" mx-auto w-fit rounded-xl border-2 border-red-600 px-3 py-[0.2rem]">
            <p className=" font-semibold text-white">Verification failed !!</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
