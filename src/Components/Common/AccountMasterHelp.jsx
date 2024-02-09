import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTableSearch from "./DataTableSearch";
import DataTablePagination from "./DataTablePagination";
import axios from "axios";
import "../../App.css";

var lActiveInputFeild = "";
var mc = '';
var label=''

const ApiDataTableModal = ({ onAcCodeClick, acType,name,companyCode,millData,mc,label,millcode,newMillCode}) => {

  const [showModal, setShowModal] = useState(false);
  const [popupContent, setPopupContent] = useState([]);
  const [enteredAcCode, setEnteredAcCode] = useState("");
  const [enteredAcName, setEnteredAcName] = useState("");
  const [enteredAccoid, setEnteredAccoid] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

  const [apiDataFetched, setApiDataFetched] = useState(false);

  label = enteredAcName


  // Fetch data based on acType
  const fetchAndOpenPopup = async () => {
    try {
     let Comapny_Code = companyCode;
     console.log(Comapny_Code)
  
      const response = await axios.get(`http://localhost:8080/getData_query?Ac_type=${acType}&Company_Code=${Comapny_Code}`);
      const data = response.data;
      setPopupContent(data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAndOpenPopup();
        setShowModal(false);  
        setApiDataFetched(true);  
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (!apiDataFetched) {
      fetchData();
    }

  }, [apiDataFetched]);  
  
  // Handle Mill Code button click
  const handleMillCodeButtonClick = (acData) => {
     lActiveInputFeild = name;
    fetchAndOpenPopup();
    if (onAcCodeClick) {
      onAcCodeClick({enteredAcCode,mc,enteredAcName});
    }
  };

    //popup functionality show and hide
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //handle onChange event for Mill Code,Broker Code and Bp Account
  const handleAcCodeChange = (event) => {
    const { value } = event.target;
    setEnteredAcCode(value);
  
    // Check if the active input field is mill code input
    if (lActiveInputFeild === name) {
      // Update enteredAcName based on the input field value
      setEnteredAcName(value);
    }
  
    const matchingItem = popupContent.find((item) => item.Ac_Code === parseInt(value, 10));
  
    if (matchingItem) {
      setEnteredAcName(matchingItem.Ac_Name_E);
      setEnteredAccoid(matchingItem.accoid);
      mc = matchingItem.accoid;
      label = matchingItem.enteredAcName;
      console.log("mc code is:", mc);
      console.log("label code is:", label);
    } else {
      setEnteredAcName("");
      setEnteredAccoid("");
    }
  };




  //After open popup onDoubleClick event that record display on the feilds
  const handleRecordDoubleClick = (item) => {
    if (lActiveInputFeild === name) {
      setEnteredAcCode(item.Ac_Code);
      mc = item.accoid
      label = item.enteredAcName
      console.log("mc code is:",mc,label);
      setEnteredAcName(item.Ac_Name_E);
  
      if (onAcCodeClick) {
        onAcCodeClick(item.Ac_Code,mc,enteredAcName);
      }
    } 

    setShowModal(false);
  };

  //handle pagination number
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  //handle search functionality
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
  };

  const filteredData = popupContent.filter((item) =>
    item.Ac_Name_E.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Gst_No.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = filteredData.slice(startIndex, endIndex);

  // Handle key events
  useEffect(() => {
    
    const handleKeyEvents = async (event) => {
      if (event.key === "F1" && acType) {
        if (event.target.id === name) {
          lActiveInputFeild = name
          fetchAndOpenPopup();
          event.preventDefault();
        }
      } else if (event.key === "ArrowUp" ) {
        event.preventDefault();
        setSelectedRowIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedRowIndex((prev) =>
          Math.min(prev + 1, itemsToDisplay.length - 1)
        );
      } else if (event.key === "Enter" ) {
        event.preventDefault();
        // Check if a row is selected
        if (selectedRowIndex >= 0) {
          handleRecordDoubleClick(itemsToDisplay[selectedRowIndex]);
        }
      }
    };
  
    window.addEventListener("keydown", handleKeyEvents);
  
    return () => {
      window.removeEventListener("keydown", handleKeyEvents);
    };
  }, [selectedRowIndex, itemsToDisplay, acType, name, fetchAndOpenPopup, handleRecordDoubleClick]);
  

  return (
    <div className="d-flex flex-row ">
      <div className="d-flex ">
        <div className="d-flex">
          <input
            type="text"
            className="form-control ms-2"
            id={name}
            autoComplete="off"
            value={enteredAcCode || millData || millcode || newMillCode}
            onChange={handleAcCodeChange}
            style={{ width: "150px", height: "35px" }}
           
          />
          <Button
            variant="primary"
            onClick={handleMillCodeButtonClick}
            className="ms-1"
            style={{ width: "30px", height: "35px" }}
          >
            ...
          </Button>
          <label id="acNameLabel" className=" form-labels ms-2">
            {enteredAcName}
          </label>
        </div>
      </div>
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        dialogClassName="modal-dialog modal-fullscreen"
      >
        <Modal.Header closeButton>
          <Modal.Title>Popup</Modal.Title>
        </Modal.Header>
        <DataTableSearch data={popupContent} onSearch={handleSearch} />
        <Modal.Body>
          {Array.isArray(popupContent) ? (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Account Code</th>
                    <th>Account Name</th>
                    <th>City</th>
                    <th>Gst No</th>
                    <th>Acco Id</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsToDisplay.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        selectedRowIndex === index ? "selected-row" : ""
                      }
                      onDoubleClick={() => handleRecordDoubleClick(item)}
                    >
                      <td>{item.Ac_Code}</td>
                      <td>{item.Ac_Name_E}</td>
                      <td>{item.cityname}</td>
                      <td>{item.Gst_No}</td>
                      <td>{item.accoid}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            "Loading..."
          )}
        </Modal.Body>

        <Modal.Footer>
          <DataTablePagination
            totalItems={filteredData.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ApiDataTableModal;