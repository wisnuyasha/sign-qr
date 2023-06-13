import React, { useState, useEffect } from "react";
import axios from "axios";
// import QRCode from "react-qr-code";
import QRCode from "qrcode";

export default function GenerateSignature() {
  const [inputFile, setInputFile] = useState(null);
  const [isUpload, setIsUpload] = useState(false);
  const [isUploadErr, setIsUploadErr] = useState(false);
  const [inputPrivateKey, setInputPrivateKey] = useState("");
  const [signature, setSignature] = useState("");
  const [signatureId, setSignatureId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isGeneratedSign, setIsGeneratedSign] = useState(false);

  async function genSign() {
    if (isUpload) {
      await axios
        .post("http://localhost:5000/sign", {
          privateKey: inputPrivateKey,
        })
        .then((res) => {
          const getSignature = res.data.signature;
          const getSignatureId = res.data.id;
          setSignature(getSignature);
          setSignatureId(getSignatureId);
          setIsGeneratedSign(true);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("please upload your file");
      setIsUploadErr(true);
    }
  }

  useEffect(() => {
    const generateQRCode = async (url) => {
      try {
        const resp = await QRCode.toDataURL(url);
        return resp;
      } catch (err) {
        console.log(err);
        return null;
      }
    };
    if (signatureId) {
      const qrUrl = `http://localhost:3000/verify/${signatureId}`;
      console.log(qrUrl);
      generateQRCode(qrUrl).then((imageUrl) => setImageUrl(imageUrl));
    }
  }, [signatureId]);

  function handleFileChange(e) {
    setInputFile(e.target.files[0]);
  }

  async function handleFileUpload() {
    const formData = new FormData();
    formData.append("file", inputFile);
    await axios
      .post("http://localhost:5000/upload", formData)
      .then((res) => {
        console.log(res.data.message);
        setIsUploadErr(false);
        setIsUpload(true);
      })
      .catch((err) => console.log(err));
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
    <div className="mx-auto mb-24 flex w-fit flex-col rounded-lg bg-igreen p-8 px-10 shadow-2xl sm:px-20 lg:px-28">
      <span className="mx-auto mb-6 text-xl font-bold text-white lg:text-3xl">
        Generate Signature
      </span>
      <div className="mb-6 lg:px-28">
        <div className="flex w-full flex-col rounded-lg bg-white px-16 py-3">
          <span className="mx-auto mb-3 text-base font-bold text-ipurple lg:text-lg">
            Data
          </span>
          <input
            className="mb-3 block w-full cursor-pointer rounded-sm border-2 bg-gray-100 text-sm text-gray-600 focus:outline-none"
            type="file"
            onChange={handleFileChange}
          />
          <button
            onClick={() => handleFileUpload()}
            type="button"
            className="text-yellow mx-auto mb-1 w-fit rounded-lg bg-igreen px-3 py-1 text-sm font-bold text-white"
          >
            Upload
          </button>
          {isUploadErr ? (
            <div className="mx-auto text-xs font-medium text-red-500">
              Please upload your file :)
            </div>
          ) : (
            ""
          )}
          {isUpload ? (
            <p className="mx-auto text-sm font-semibold text-igreen">
              File uploaded !!
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="mb-6 flex flex-col  gap-y-5 lg:gap-x-8">
        <div className="flex flex-col gap-2 rounded-lg bg-white px-7 py-4 lg:px-12 lg:pb-8">
          <span className="mx-auto text-base font-bold text-ipurple lg:text-lg">
            Private Key
          </span>
          <textarea
            rows="4"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
            value={inputPrivateKey}
            onChange={(event) => setInputPrivateKey(event.target.value)}
            placeholder="Input your private key"
          />
        </div>
      </div>
      <div className="mb-6 w-full px-10 lg:px-32">
        <div className="flex flex-col gap-3 rounded-lg bg-white px-7 py-4 lg:px-12">
          <span className="mx-auto text-base font-bold text-ipurple lg:text-lg">
            Signature
          </span>
          <textarea
            rows="1"
            className="mb-2 block w-full rounded-lg border border-gray-300 bg-gray-50 p-6 py-3 text-sm"
            value={signature}
            readOnly
            placeholder="Signature will be generated here"
          />
          {isGeneratedSign ? (
            <a href={imageUrl} download className="mx-auto mb-2 h-full">
              <img src={imageUrl} alt="QRCODE" />
            </a>
          ) : null}
          <button
            onClick={() => handleCopy(signature)}
            className="text-yellow mx-auto w-fit rounded-lg bg-igreen px-3 py-1 text-sm font-bold text-white"
          >
            Copy
          </button>
        </div>
      </div>
      <button
        onClick={genSign}
        className="mx-auto mb-3 w-fit rounded-lg bg-iyellow px-3 py-2 font-bold text-ipurple"
        type="button"
      >
        Generate
      </button>
      {isGeneratedSign ? (
        <div className=" mx-auto w-fit rounded-xl border-2 border-iyellow px-3 py-[0.2rem]">
          <p className=" font-semibold text-white">
            Signature & QR code generated !!
          </p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
