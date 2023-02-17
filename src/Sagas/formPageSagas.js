import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 } from "uuid";
import { storage, db } from "../firebase";
import * as fireStore from "firebase/firestore";
import { doc, getDoc, query } from "firebase/firestore";

export const imageUploader = ({
  path = "postImages",
  file,
  setIsloading = () => null,
  setIsError = () => null,
  setIsSuccess = () => null,
}) => {
  setIsloading(true);
  setIsError("");
  const storageRef = ref(storage, `${path}/${v4()}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
    },
    (error) => {
      setIsError(error);
      setIsloading(false);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        setIsSuccess(downloadURL);
        setIsloading(false);
      });
    }
  );
};

export const addInventory = (data) =>
  new Promise((resolve, reject) => {
    fireStore
      .setDoc(fireStore.doc(db, "posts", v4()), data)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e.message);
      });
  });

export const fetchInventory = () =>
  new Promise((resolve, reject) => {
    fireStore
      .getDocs(query(fireStore.collection(db, "posts")))
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        reject();
      });
  });
