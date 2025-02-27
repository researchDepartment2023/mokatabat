import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import isArrEmpty from "../../../../utils/isArrEmpty";
import isObjEmpty from "../../../../utils/isObjEmpty";
import Select from "react-select";
import get from "../../../serverApis/get";
import { useQuery } from "react-query";

interface SearchFormProps {
  setDocNum: any;
  setGehaaId: any;
  setsubject: any;
  setBranchId: any;
  setOfficerId: any;
  docNum: any;
  gehaaId: any;
  subject: any;
  branchId: any;
  officerId: any;
  mokatbaDate: any;
  setMokatbaDate: any;
  closedWaredDocNum: any;
  isFetchUnreadSader: any;
  setIsFetchUnreadSader: any;
  setClosedWaredDocNum: any;
  fetchSearchResults: any;
}
function SearchBox(props: SearchFormProps) {
  const [isSearched, setIsSearched] = useState(false);

  const clearSearchParamsAndRefetch = () => {
    props.setDocNum("");
    props.setGehaaId("");
    props.setsubject("");
    props.setBranchId("");
    props.setOfficerId("");
    props.setMokatbaDate("");
    props.setClosedWaredDocNum("");
    props.setIsFetchUnreadSader(false);
    setIsSearched(false);

    props.fetchSearchResults();
  };
  /*   useEffect(() => {
    axios.get("/api/saderoptions").then((res) => {
      setGehaatOptions(res.data.gehaat);
      setBranchsOptions(res.data.branches);
      setOfficersOptions(res.data.officers);
    });
  }, []); */

  const {
    data: saderOptions,
    isSuccess: isSaderOptionsSuccessed,
    error,
    refetch: refetchSaderOptions,
  } = useQuery(["saderOptions"], () => {
    return get("/api/saderoptions");
  });

  console.log(saderOptions);

  const getOptionNameById = useCallback((optionId: string, options: any[]) => {
    // console.log({gehaaId})
    let optionObj: any = options.find((option: any) => option.id === optionId);
    // console.log({ gehaaObj, gehaaId });

    if (optionObj) {
      return optionObj.name;
    } else {
      return "";
    }
  }, []);

  const getGehaaNameById = (gehaaId: string, gehaatOptions: any[]) => {
    return getOptionNameById(gehaaId, gehaatOptions);
  };

  const getBranchNameById = (branchId: string, branchsOptions: any[]) => {
    return getOptionNameById(branchId, branchsOptions);
  };

  const getOfficerNameById = (officerId: string, officersOptions: any[]) => {
    return getOptionNameById(officerId, officersOptions);
  };
  return (
    <div>
      <div className="p-3 border mb-4 mt-4" dir="">
        <form
          className="row g-3 fs-3"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="col-md-3">
            <label className="form-label">رقم الصادر</label>
            <input
              type="text"
              className="form-control fs-4"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={props.docNum}
              onChange={(e) => {
                props.setDocNum(e.target.value);
              }}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">تاريخ الصادر</label>
            <input
              type="date"
              className="form-control fs-3"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={props.mokatbaDate}
              onChange={(e) => {
                props.setMokatbaDate(e.target.value);
              }}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">موضوع المكاتبة</label>
            <input
              type="text"
              className="form-control fs-3"
              id="exampleInputEmail1"
              value={props.subject}
              aria-describedby="emailHelp"
              onChange={(e) => {
                props.setsubject(e.target.value);
              }}
            />
          </div>

          {isSaderOptionsSuccessed && (
            <div className="col-md-3">
              <label className="form-label">جهة الصادر</label>
              <Select
                value={{
                  value: props.gehaaId,
                  label: getGehaaNameById(props.gehaaId, saderOptions.gehaat),
                }}
                onChange={(gehaaOption: any) => {
                  props.setGehaaId(gehaaOption.value);
                }}
                options={saderOptions.gehaat.map((gehaa: any) => {
                  return {
                    value: gehaa.id,
                    label: gehaa.name,
                  };
                })}
              />
            </div>
          )}

          {isSaderOptionsSuccessed && (
            <div className="col-md-3">
              <label className="form-label">الضابط المختص</label>
              <Select
                value={{
                  value: props.officerId,
                  label: getOfficerNameById(
                    props.officerId,
                    saderOptions.officers
                  ),
                }}
                onChange={(officerOption: any) => {
                  props.setOfficerId(officerOption.value);
                }}
                options={saderOptions.officers.map((branch: any) => {
                  return {
                    value: branch.id,
                    label: branch.name,
                  };
                })}
              />
            </div>
          )}

          {isSaderOptionsSuccessed && (
            <div className="col-md-3">
              <label className="form-label">الفرع المختص</label>
              <Select
                value={{
                  value: props.branchId,
                  label: getBranchNameById(
                    props.branchId,
                    saderOptions.branches
                  ),
                }}
                onChange={(branchOption: any) => {
                  props.setBranchId(branchOption.value);
                }}
                options={saderOptions.branches.map((branch: any) => {
                  return {
                    value: branch.id,
                    label: branch.name,
                  };
                })}
              />
            </div>
          )}

          {/* TODO */}
          <div className="col-md-3">
            <label className="form-label"> رقم وارد وجوب الرد:</label>
            <input
              type="text"
              className="form-control fs-4"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={props.closedWaredDocNum}
              onChange={(e) => {
                props.setClosedWaredDocNum(e.target.value);
              }}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">صوادر لم تتم قرائتها</label>
            <br />
            <input
              type="checkbox"
              className="form-check-input"
              checked={props.isFetchUnreadSader}
              onChange={() => {
                props.setIsFetchUnreadSader(!props.isFetchUnreadSader);
              }}
            />
          </div>
          <div className="d-flex justify-content-evenly">
            {/* <button
              className="btn btn-primary fs-4 btn-lg  px-5"
              onClick={() => {
                props.fetchSearchResults();
                setIsSearched(true);
              }}
            >
              بحث
            </button> */}
            <button
              className="btn btn-danger fs-4 btn-lg px-5"
              onClick={() => {
                clearSearchParamsAndRefetch();
              }}
            >
              الغاء البحث
            </button>
          </div>
        </form>
        <div></div>
      </div>
      {isSearched && (
        <>
          <h2>نتائج البحث</h2>
        </>
      )}
    </div>
  );
}
export { SearchBox };
