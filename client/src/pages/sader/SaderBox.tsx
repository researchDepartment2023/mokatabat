import { useEffect, useState } from "react";
import { SaderTabelTR } from "../../features/sader/components/saderTabelTr";
import { SearchBox } from "../../features/sader/components/searchBox";
import axios from "axios";
import Spinner from "../../components/HorizontalSpinner";
import socket from "../../services/socket-io";
import { selectUser } from "../../features/user/stores/userSlice";
import { useSelector } from "react-redux";
import { socketIoEvent } from "../../types";
import Overlay from "../../components/Overlay/Overlay";
import SaderOverlayContent from "../../features/sader/components/saderOverlayContent";
import { useQuery } from "react-query";
import get from "../../features/serverApis/get";

function SaderBox() {
  const user = useSelector(selectUser);
  const [numOfRecords, setNumOfRecords] = useState<any>(20);
  const [pageNum, setPageNum] = useState<any>(1);

  const [docNum, setDocNum] = useState("");
  const [closedWaredDocNum, setClosedWaredDocNum] = useState("");
  const [gehaaId, setGehaaId] = useState("");
  const [subject, setsubject] = useState("");
  const [branchId, setBranchId] = useState("");
  const [officerId, setOfficerId] = useState<any>("");
  const [mokatbaDate, setMokatbaDate] = useState("");
  const [isSaderOverlayOpen, setIsSaderOverlayOpen] = useState(false);

  const [opennedSaderIdInOverlay, setOpennedSaderIdInOverlayId] =
    useState<any>("");

  const [isFetchUnreadSader, setIsFetchUnreadSader] = useState(false);
  const {
    data: fetchedSader,
    isLoading: isSaderLoading,
    error,
    refetch: refetchSader,
  } = useQuery(
    [
      "fetchSader",
      docNum,
      gehaaId,
      closedWaredDocNum,
      subject,
      branchId,
      officerId,
      mokatbaDate,
      pageNum,
      numOfRecords,
      isFetchUnreadSader,
    ],
    () => {
      const params = {
        docNum,
        gehaaId,
        closedWaredDocNum,
        subject,
        branchId,
        officerId,
        mokatbaDate,
        pageNum: pageNum - 1,
        numOfRecords,
        unreadSader: isFetchUnreadSader,
      };

      return get("/api/saderbox/search", params);
    }
  );

  useEffect(() => {
    const controller = new AbortController();
    return () => {
      controller.abort();
    };
    // cancel the request
  }, []);

  useEffect(() => {
    if (user) {
      socket.on(socketIoEvent.refetchSader, refetchSader);
      socket.on(socketIoEvent.refetchSader + user.id, refetchSader);
    }
    return () => {
      socket.off(socketIoEvent.refetchSader, refetchSader);
      socket.off(socketIoEvent.refetchSader + user.id, refetchSader);
    };
  }, [
    docNum,
    gehaaId,
    closedWaredDocNum,
    subject,
    branchId,
    officerId,
    mokatbaDate,
    pageNum,
    numOfRecords,
  ]);

  useEffect(() => {
    setIsSaderOverlayOpen(!!opennedSaderIdInOverlay);
  }, [opennedSaderIdInOverlay]);

  useEffect(() => {
    if (!isSaderOverlayOpen) {
      setOpennedSaderIdInOverlayId("");
    }
  }, [isSaderOverlayOpen]);

  return (
    <>
      {isSaderOverlayOpen && (
        <Overlay
          isOpen={isSaderOverlayOpen}
          setIsWaredOverlayOpen={setIsSaderOverlayOpen}
        >
          <SaderOverlayContent saderId={opennedSaderIdInOverlay} />
        </Overlay>
      )}
      <div className={"container"} style={{ minHeight: "1000" }}>
        <div className="fs-2 fw-bold">صندوق الصادر</div>
        <SearchBox
          docNum={docNum}
          setDocNum={setDocNum}
          gehaaId={gehaaId}
          setGehaaId={setGehaaId}
          subject={subject}
          setsubject={setsubject}
          branchId={branchId}
          setBranchId={setBranchId}
          officerId={officerId}
          setOfficerId={setOfficerId}
          mokatbaDate={mokatbaDate}
          closedWaredDocNum={closedWaredDocNum}
          setClosedWaredDocNum={setClosedWaredDocNum}
          setMokatbaDate={setMokatbaDate}
          fetchSearchResults={refetchSader}
          isFetchUnreadSader={isFetchUnreadSader}
          setIsFetchUnreadSader={setIsFetchUnreadSader}
        />
        <span className="fs-3">
          رقم الصفحة :
          <input
            type="number"
            className="form-control fs-3 d-inline"
            style={{ width: "50px" }}
            min={1}
            value={pageNum}
            onChange={(e) => {
              setPageNum(e.target.value);
            }}
          />
        </span>
        <div className="fs-4">
          <label htmlFor="">عدد المكاتبات للصفحة : </label>
          <select
            name=""
            id=""
            className="form-select fs-3 d-inline"
            style={{ width: "50px" }}
            onChange={(e) => {
              setNumOfRecords(e.target.value);
            }}
          >
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <div className="d-flex my-2">
          <label className="fs-4">مكاتبات تم الإطلاع عليها بالكامل</label>

          <div
            className="bg-secondary mx-2"
            style={{ width: "20px", borderRadius: "5px" }}
          >
            .
          </div>
        </div>
        <hr />
        {isSaderLoading ? (
          <Spinner />
        ) : (
          <>
            {fetchedSader && (
              <>
                <table className="table table-hover fs-4">
                  <thead className={""}>
                    <tr>
                      <th scope="col" style={{ width: "10%" }}>
                        رقم الصادر
                      </th>
                      <th scope="col" style={{ width: "10%" }}>
                        تاريخ الصادر
                      </th>
                      <th scope="col" style={{ width: "25%" }}>
                        موضوع الصادر
                      </th>
                      <th scope="col" style={{ width: "20%" }}>
                        جهة الصادر
                      </th>

                      <th scope="col" style={{ width: "12%" }}>
                        الضابط المختص
                      </th>
                      <th scope="col" style={{ width: "12%" }}>
                        الفرع المختص
                      </th>

                      {/* <th scope="col">الإتجاه المختص</th> */}
                      {/* <th scope="col">الضابط المختص</th> */}
                      <th scope="col" style={{ width: "15%" }}>
                        وجوب رد وارد رقم
                      </th>
                      {/* <th scope="col">متصلة بوارد</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {fetchedSader.map((row: any) => {
                      return (
                        <SaderTabelTR
                          row={row}
                          setOpennedSaderIdInOverlayId={
                            setOpennedSaderIdInOverlayId
                          }
                        ></SaderTabelTR>
                      );
                    })}
                  </tbody>
                </table>
                <div className="d-flex justify-content-center align-items-center">
                  <div className="d-flex flex-column text-center">
                    <span className="fs-3">رقم الصفحة :{pageNum}</span>

                    <nav aria-label="Page navigation example" className="fs-4">
                      <ul className="pagination">
                        {pageNum > 1 && (
                          <li className="page-item">
                            <button
                              className="page-link fs-3"
                              onClick={() => {
                                setPageNum(Number(pageNum) - 1);
                              }}
                            >
                              الصفحة السابقة
                            </button>
                          </li>
                        )}
                        {fetchedSader.length >= numOfRecords && (
                          <li className="page-item">
                            <button
                              className="page-link fs-3"
                              onClick={() => {
                                setPageNum(Number(pageNum) + 1);
                              }}
                            >
                              الصفحةالتالية
                            </button>
                          </li>
                        )}
                      </ul>
                    </nav>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
export default SaderBox;
