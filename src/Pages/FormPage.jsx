import React, { useCallback, useEffect, useRef, useState } from "react";
import GroupField from "../Components/GroupField";
import redCross from "../assets/redCross.png";
import addIcon from "../assets/addIcon.png";
import { addInventory, imageUploader } from "../Sagas/formPageSagas";
import "./styles/formStyles.scss";
import { Alert, CircularProgress, Snackbar } from "@mui/material";
import { Timestamp } from "firebase/firestore";

export const FormPage = () => {
  const timeRef = useRef();
  const imageRef = useRef();
  const imageRefLabels = useRef();
  const [DamageImages, setDamageImages] = useState([]);
  const [DamageImagesToUpload, setDamageImagesToUpload] = useState([]);
  const [labelImages, setLabelImages] = useState([]);
  const [labelImagesToUpload, setLabelImagesToUpload] = useState([]);
  const [regoNumber, setRegoNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [notificationStatus, setNotificationStatus] = useState("success");

  const handleCloseNotification = useCallback(
    () => setShowNotification(false),
    []
  );
  const clearFields = () => {
    setDamageImages([]);
    setDamageImagesToUpload([]);
    setLabelImages([]);
    setLabelImagesToUpload([]);
    setRegoNumber("");
    setClientName("");
    setOrderNumber("");
    setComments("");
    setIsSubmit("");
  };

  useEffect(() => {
    if (!showNotification) return;
    clearTimeout(timeRef);
    timeRef.current = setTimeout(() => {
      handleCloseNotification();
    }, 6000);
  }, [showNotification, handleCloseNotification]);

  const onSubmit = () => {
    setIsSubmit(true);

    if (
      regoNumber.length === 0 ||
      clientName.length === 0 ||
      orderNumber.length === 0 ||
      comments.length === 0
    ) {
      return;
    }
    setIsLoading(true);
    const data = {
      regoNumber,
      clientName,
      orderNumber,
      comments,
      labelImages: labelImagesToUpload,
      damageImages: DamageImagesToUpload,
      date: Timestamp.now()
    };

    addInventory(data)
      .then(() => {
        setIsLoading(false);
        setIsSubmit(false);
        setShowNotification(true);
        setNotificationText("Data submitted successfully");
        setNotificationStatus('success')
        clearFields();
      })
      .catch((e) => {
        setIsLoading(false);
        setIsSubmit(false);
        setShowNotification(true);
        setNotificationText(e.message);
        setNotificationStatus('error')
      });
  };

  const onDeleteImage = (i, type) => {
    if (type === "damages") {
      setDamageImages(DamageImages.filter((item, index) => index !== i));
      setDamageImagesToUpload(
        DamageImagesToUpload.filter((item, index) => index !== i)
      );
      return;
    }
    setLabelImages(labelImages.filter((item, index) => index !== i));
    setLabelImagesToUpload(
      labelImagesToUpload.filter((item, index) => index !== i)
    );
  };

  const handleFileDamages = (e, index) => {
    const file = e.target.files[0];
    imageUploader({
      file,
      setIsloading: (loader) => {
        if (!loader) return;
        const list = [...DamageImages];
        setDamageImages([...list, { url: window.URL.createObjectURL(file) }]);
        setIsLoading(true)
      },
      setIsSuccess: (url) => {
        const list = [...DamageImagesToUpload];
        setDamageImagesToUpload([...list, { url }]);
        setIsLoading(false)
      },
    });
  };

  const handleFileLabels = (e, index) => {
    const file = e.target.files[0];
    imageUploader({
      file,
      setIsloading: (loader) => {
        if (!loader) return;
        const list = [...labelImages];
        setLabelImages([...list, { url: window.URL.createObjectURL(file) }]);
        setIsLoading(true)
      },
      setIsSuccess: (url) => {
        const list = [...labelImagesToUpload];
        setLabelImagesToUpload([...list, { url }]);
        setIsLoading(false)
      },
    });
  };

  return (
    <div className="w-full items-center justify-center my-10 flex">
      <div className="w-[90%] max-w-[800px] border rounded py-6 px-4">
        <p className="text-[22px] text-center font-bold">
          Shuttle Load Inspection
        </p>
        <br />
        <GroupField
          submitFailed={isSubmit}
          value={regoNumber}
          onChange={(e) => setRegoNumber(e.target.value)}
          label={"REGO NUMBER"}
          placeholder={"Write rego number here"}
          error={regoNumber.length === 0 && "Field is Required"}
        />
        <GroupField
          submitFailed={isSubmit}
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          label={"CLIENT NAME"}
          placeholder={"Write client name here"}
          error={clientName.length === 0 && "Field is Required"}
        />
        <GroupField
          submitFailed={isSubmit}
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          label={"ORDER NUMBER"}
          placeholder={"Write order number here"}
          error={orderNumber.length === 0 && "Field is Required"}
        />

        <div className="mt-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            PICTURE OF DAMAGES
          </label>
          <div className="flex flex-wrap gap-6">
            {DamageImages.map((item, i) => (
              <div
                key={i}
                className="w-[100px] h-[100px] rounded border-2 border-slate-800 flex items-center justify-center cursor-pointer"
              >
                <div className="image relative">
                  <img
                    src={item?.isLoading ? item?.demoPath : item?.url}
                    className={"w-[95px] h-[95px] object-contain"}
                    alt={"add"}
                  />
                  <div
                    onClick={() => onDeleteImage(i, "damages")}
                    className="w-[98px] h-[98px] backDrop"
                  >
                    <img
                      src={redCross}
                      className={"w-[30px] h-[30px] object-contain"}
                      alt={"close"}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div
              onClick={() => imageRef.current.click()}
              className="w-[100px] h-[100px] rounded border-2 border-slate-800 flex items-center justify-center cursor-pointer"
            >
              <img
                src={addIcon}
                className={"w-[30px] h-[30px] object-contain"}
                alt={"add"}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">
            PICTURE OF LABELS
          </label>
          <div className="flex flex-wrap gap-6">
            {labelImages.map((item, i) => (
              <div
                key={i}
                className="w-[100px] h-[100px] rounded border-2 border-slate-800 flex items-center justify-center cursor-pointer"
              >
                <div className="image relative">
                  <img
                    src={item?.isLoading ? item?.demoPath : item?.url}
                    className={"w-[95px] h-[95px] object-contain"}
                    alt={"add"}
                  />
                  <div
                    onClick={() => onDeleteImage(i, "labels")}
                    className="w-[98px] h-[98px] backDrop"
                  >
                    <img
                      src={redCross}
                      className={"w-[30px] h-[30px] object-contain"}
                      alt={"close"}
                    />
                  </div>
                </div>
              </div>
            ))}
            <div
              onClick={() => imageRefLabels.current.click()}
              className="w-[100px] h-[100px] rounded border-2 border-slate-800 flex items-center justify-center cursor-pointer"
            >
              <img
                src={addIcon}
                className={"w-[30px] h-[30px] object-contain"}
                alt={"add"}
              />
            </div>
          </div>
        </div>


        <GroupField
          submitFailed={isSubmit}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          label={"COMMENTS"}
          placeholder={"Write comments here"}
          error={comments.length === 0 && "Field is Required"}
        />
        <br />
        <center>
          <div
            onClick={isLoading ? () => null : () => onSubmit()}
            className="shadow py-2 px-8 rounded w-max bg-purple-500 text-white cursor-pointer"
          >
            {isLoading ? <CircularProgress color='primary' /> : "Submit"}
            
          </div>
        </center>
      </div>
      <input
        accept="image/png, image/jpeg"
        ref={imageRef}
        onChange={(e) => handleFileDamages(e)}
        type={"file"}
        className={"hidden"}
      />
      <input
        accept="image/png, image/jpeg"
        ref={imageRefLabels}
        onChange={(e) => handleFileLabels(e)}
        type={"file"}
        className={"hidden"}
      />
      <Snackbar
        open={showNotification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notificationStatus}
          sx={{ width: "100%" }}
        >
          {notificationText}
        </Alert>
      </Snackbar>
    </div>
  );
};
