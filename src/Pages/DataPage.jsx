import { CircularProgress } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import GroupField from "../Components/GroupField";
import { fetchInventory } from "../Sagas/formPageSagas";

export const DataPage = () => {
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFilteredData(
      data.filter((item) =>
      item.clientName?.toLowerCase().includes(search?.toLowerCase()) ||
      item.comments?.toLowerCase().includes(search?.toLowerCase()) ||
      item.orderNumber?.toLowerCase().includes(search?.toLowerCase()) ||
      item.regoNumber?.toLowerCase().includes(search?.toLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    setFilteredData(
        fromDate ? data.filter((item) => moment(item.date?.toDate()).diff(fromDate, 'hours') > 0) : data
    );
  }, [fromDate, toDate]);

  useEffect(() => {
    const data = [];
    setIsLoading(true);
    fetchInventory()
      .then((res) => {
        res.forEach((item) => {
          data.push({ ...item.data(), id: item.id });
        });
      })
      .then(() => {
        setIsLoading(false);
        setData(data);
        setFilteredData(data);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);

  console.log({ data });

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-[90%] max-w-[1000px]">
        <div className="w-full flex gap-2 flex-wrap">
          <div className="min-w-[600px]">
            <GroupField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Client name, Order number, Rego number, Comment"
              label={"Search"}
            />
          </div>
          <div className="flex gap-2">
            <GroupField
              type={"date"}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="from date"
              label={"From date"}
            />
            <GroupField
              type={"date"}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="to date"
              label={"To date"}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center mt-20">
            <CircularProgress />
          </div>
        ) : filteredData.length > 0 ? (
          <div className="w-full mt-2">
            {filteredData.map((item, i) => (
              <div key={i} className="border-2 rounded py-2 px-2 mt-4 w-full">
                <p>
                  REGO NUMBER: <b>{item?.regoNumber}</b>
                </p>
                <p className="mt-2">
                  CLIENT NAME: <b>{item?.clientName}</b>
                </p>
                <p className="mt-2">
                  ORDER NUMBER: <b>{item?.orderNumber}</b>
                </p>
                <p className="mt-2">
                  COMMENTS: <b>{item?.comments}</b>
                </p>
                <p className="mt-2">
                  CREATED AT:{" "}
                  <b>
                    {moment(data?.createdAt?.toDate()).format("DD/MM/YYYY")}
                  </b>
                </p>
                {item?.damageImages?.length > 0 && (
                  <div className="mt-2">
                    <p>PICTURE OF DAMAGES:</p>

                    <div className="mt-2 overflow-x-auto flex gap-3">
                      {item?.damageImages.map((images, imagesIndex) => (
                        <img
                          key={imagesIndex}
                          className="w-[full] max-w-[300px] h-[300px]"
                          src={images.url || ""}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {item?.labelImages?.length > 0 && (
                  <div className="mt-2">
                    <p>PICTURE OF LABELS:</p>

                    <div className="mt-2 overflow-x-auto flex gap-3">
                      {item?.labelImages.map((images, imagesIndex) => (
                        <img
                          key={imagesIndex}
                          className="w-[full] max-w-[300px] h-[300px]"
                          src={images.url || ""}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
            <div className="flex items-center justify-center mt-20">
            <p>NO DATA FOUND!</p>
          </div>
        )}
      </div>
    </div>
  );
};
