import React, {useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import axios from "axios";
import FolderComponent from "./Folder";
import RealTime from "../../../helpers/realtime.helper";

async function fetcher(url) {
  const res = await axios.get(url);
  return res.data;
}

const API_URL = window.location.hostname.includes("localhost")
  ? "http://localhost:5500/api/v1"
  : "https://companyfiles.zuri.chat/api/v1";

const index = () => {
  const { data, error } = useSWR(`${API_URL}/folders/all`, fetcher);

  const [newFolders, setNewFolders] = useState({ data: {} });

  // let progress = useRef(false)

  useEffect(() => {
    const fetchNewData = () => {
      RealTime.subscribe("allFolders", "", (data) => setNewFolders(data));
    };
    fetchNewData();
    console.log(newFolders);
  }, []);

  if (error)
    return (
      <div className="tw-text-3xl tw-flex tw-items-center tw-justify-center tw-text-red-600 py-4">
        failed to load
      </div>
    );

  if (!data)
    return (
      <div className="tw-text-3xl tw-flex tw-items-center tw-justify-center py-4">
        loading...
      </div>
    );

  return (
    <div className="tw-w-full tw-py-10 ">
      <div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-mb-4">
        <h2 className="tw-text-lg tw-font-semibold tw-text-gray-900">Folders</h2>
        <Link
          to="/all-folders"
          className="tw-text-green-500 tw-text-lg tw-font-semibold hover:tw-text-green-600"
        >
          View All
        </Link>
      </div>
      <div className="tw-flex tw-flex-wrap tw-justify-between">
        {data.data.length ? (
          data.data
            .slice(0, 4)
            .map((folder) => (
              <FolderComponent key={folder.folderId} folder={folder} />
            ))
        ) : (
          <div className="tw-text-3xl tw-flex tw-items-center tw-justify-center">
            No Folders
          </div>
        )}
      </div>
    </div>
  );
};

export default index;
