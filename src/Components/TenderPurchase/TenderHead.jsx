import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiMill_Code from "../Helps/AccountMasterHelp";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import ActionButtonGroup from '../Common/CommonButtons/ActionButtonGroup';
import NavigationButtons from "../Common/CommonButtons/NavigationButtons";

var newTenderId = "";
var newMillCode = "";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [Buyer, setName] = useState("");
  const [Lifting_Date, setLifting_Date] = useState("");
  const [userId, setUserId] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [millCode, setMillCode] = useState("");
  const [mc, setMc] = useState("");
  const [label, setLabel] = useState("");
  const navigate = useNavigate();

  const [updateButtonClicked, setUpdateButtonClicked] = useState(false);
  const [saveButtonClicked, setSaveButtonClicked] = useState(false);
  const [addOneButtonEnabled, setAddOneButtonEnabled] = useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(true);
  const [cancelButtonEnabled, setCancelButtonEnabled] = useState(true);
  const [editButtonEnabled, setEditButtonEnabled] = useState(false);
  const [deleteButtonEnabled, setDeleteButtonEnabled] = useState(false);
  const [backButtonEnabled, setBackButtonEnabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState(null);
  const [cancelButtonClicked, setCancelButtonClicked] = useState(false);
  const [firstTenderData, setFirstTenderData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [lastTenderDetails, setLastTenderDetails] = useState([]);

  //handle Add button Functionality
  const handleAddOne = async () => {
    try {
      const response = await fetch("http://localhost:8080/get_last_tender_no");
      if (response.ok) {
        const data = await response.json();
        const nextTenderNo = data.lastTenderNo + 1;
        setFormData({
          Tender_No: nextTenderNo,
          Tender_Date: "",
          Mill_Code: "",
        });

        setUsers([]);
        setShowPopup(false);
        setSelectedUser({});
        setName("");
        setLifting_Date("");
        setUserId("");
        setMillCode("");
        setMc("");
        setLabel("");
        newMillCode = ""

        // Disable the add button and enable other buttons
        setAddOneButtonEnabled(false);
        setSaveButtonEnabled(true);
        setCancelButtonEnabled(true);
        setEditButtonEnabled(false);
        setDeleteButtonEnabled(false);
        setIsEditMode(false);
        setIsEditing(true);
      } else {
        console.error(
          "Failed to fetch last tender number:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  //handle Edit button Functionality
  const handleEdit = () => {
    setIsEditMode(true);
    setAddOneButtonEnabled(false);
    setSaveButtonEnabled(true);
    setCancelButtonEnabled(true);
    setEditButtonEnabled(false);
    setDeleteButtonEnabled(false);
    setBackButtonEnabled(true);
    setIsEditing(true);
  };

  //handle New record insert in datatbase and update the record Functionality
  const handleSaveOrUpdate = async () => {
    setIsEditing(true);
    const headData = {
      Company_Code: 1,
      Year_Code: 1,
      Tender_Date: formData.Tender_Date,
      Mill_Code: formData.Mill_Code,
    };

    const detailData = users.map((user) => ({
      rowaction: user.rowaction,
      Company_Code: 1,
      year_code: 1,
      ID: user.id,
      Buyer: user.Buyer,
      Lifting_Date: user.Lifting_Date,
      Buyer_Party: user.Mill_Code,
      tenderdetailid: user.tenderdetailid,
    }));

    const requestData = {
      headData,
      detailData,
    };

    try {
      if (isEditMode) {
        const updateApiUrl = `http://localhost:8080/update_sugar_purchase?tenderid=${newTenderId}`;

        const response = await axios.put(updateApiUrl, requestData);
        console.log("Data updated successfully:", response.data);
        window.location.reload();
      } else {
        // Check if both headData and detailData are not empty
        if (
          requestData.detailData.length === 0 ||
          Object.values(requestData.headData).some((value) => value === "")
        ) {
          window.alert("Please add both head and detail data before saving.");
        } else {
          const response = await axios.post(
            "http://localhost:8080/insert_tender_head_detail",
            requestData
          );
          console.log("Data saved successfully:", response.data);
          window.alert("data save success");
          setIsEditMode(false);
          setAddOneButtonEnabled(true);
          setEditButtonEnabled(true);
          setDeleteButtonEnabled(true);
          setBackButtonEnabled(true);
          setSaveButtonEnabled(false);
          setCancelButtonEnabled(false);
          setIsEditing(true);
          // window.location.reload();
        }
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

//handle Delete the record from database functionality
  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete this tender ID ${newTenderId}?`
    );

    if (isConfirmed) {
      setIsEditMode(false);
      setAddOneButtonEnabled(true);
      setEditButtonEnabled(true);
      setDeleteButtonEnabled(true);
      setBackButtonEnabled(true);
      setSaveButtonEnabled(false);
      setCancelButtonEnabled(false);

      try {
        const deleteApiUrl = `http://localhost:8080/delete_tender?tenderid=${newTenderId}`;
        const response = await axios.delete(deleteApiUrl);

        if (response.status === 200) {
          console.log("Tender deleted successfully");
          window.location.reload();
        } else {
          console.error(
            "Failed to delete tender:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("Error during API call:", error);
      }
    } else {
      console.log("Deletion cancelled");
    }
  };

  const [lastTenderData, setLastTenderData] = useState({});
  const [lastTenderDetailData, setLastTenderDetailData] = useState([]);

  // const fetchLastTenderData = async () => {
  //   try {
  //     const response = await fetch(
  //       "http://localhost:8080/get_last_tender_data"
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       newTenderId = data.last_tender_head_data.tenderid;
  //       newMillCode = data.last_tender_head_data.Mill_Code;
  //       console.log("++++newTenderId+++", newTenderId);
  //       console.log("++++Mill_Code+++", newMillCode);
  //       setLastTenderData(data.last_tender_head_data || {});
  //       setLastTenderDetails(data.last_tender_details_data || []);
  //     } else {
  //       console.error(
  //         "Failed to fetch last tender data:",
  //         response.status,
  //         response.statusText
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error during API call:", error);
  //   }
  // };

  // useEffect(() => {
  //   handleAddOne();
  // }, []);



  // handleCancel button cliked show the last record for edit functionality
  const handleCancel = async () => {
    setIsEditing(false);
    setIsEditMode(false);
    setAddOneButtonEnabled(true);
    setEditButtonEnabled(true);
    setDeleteButtonEnabled(true);
    setBackButtonEnabled(true);
    setSaveButtonEnabled(false);
    setCancelButtonEnabled(false);
    setCancelButtonClicked(true);

    try {
      const response = await fetch(
        "http://localhost:8080/get_last_tender_data"
      );
      if (response.ok) {
        const data = await response.json();
        console.log("csncelData", data)
        newMillCode = data.last_tender_head_data.Mill_Code

        // Update form data with the last tender data
        setFormData((prevData) => ({
          ...prevData,
          Tender_No: data.last_tender_head_data.Tender_No || "",
          Tender_Date: data.last_tender_head_data.Tender_Date || "",
          Mill_Code: newMillCode || "",
        }));

        setLastTenderData(data.last_tender_head_data || {});
        setLastTenderDetails(data.last_tender_details_data || []);
      } else {
        console.error(
          "Failed to fetch last tender data:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

//Navigation Functionality to show first,previous,next and last record functionality
  const handleFirstButtonClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/get_first_tender_data");
      if (response.ok) {
        const data = await response.json();
        newMillCode = data.first_tender_head_data.Mill_Code
        setFirstTenderData(data.first_tender_head_data || {});
        setLastTenderDetails(data.first_tender_details_data || []);
        setFormData({
          Tender_No: data.first_tender_head_data.Tender_No || "",
          Tender_Date: data.first_tender_head_data.Tender_Date || "",
          Mill_Code: newMillCode || "",
        });

      } else {
        console.error("Failed to fetch first tender data:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };


  // useEffect(() => {
  //   fetchLastTenderData();
  // }, []);

  // Function to fetch the last record
  const handleLastButtonClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/get_last_tender_data_Navigation");
      if (response.ok) {
        const data = await response.json();
        newTenderId = data.last_tender_head_data.tenderid;
        newMillCode = data.last_tender_head_data.Mill_Code;
        console.log("++++newTenderId+++", newTenderId);
        console.log("++++Mill_Code+++", newMillCode);
        setLastTenderData(data.last_tender_head_data || {});
        setLastTenderDetails(data.last_tender_details_data || []);
        // Update form data and other state variables with fetched data
        setFormData({
          Tender_No: data.last_tender_head_data.Tender_No || "",
          Tender_Date: data.last_tender_head_data.Tender_Date || "",
          Mill_Code: newMillCode || "",
        });
       
      } else {
        console.error("Failed to fetch last tender data:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  // Function to fetch the next record
  const handleNextButtonClick = async () => {
    try {
      const response = await fetch(`http://localhost:8080/get_next_tender_data?current_tender_no=${formData.Tender_No}`);
      if (response.ok) {
        const data = await response.json();
        newMillCode = data.next_tender_head_data.Mill_Code
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...data.next_tender_head_data,
          Mill_Code: newMillCode || "",
        }));
        setLastTenderDetails(data.next_tender_details_data || []);
      } else {
        console.error("Failed to fetch next tender data:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };


  // Function to fetch the previous record
  const handlePreviousButtonClick = async () => {
    try {
      // Use formData.Tender_No as the current tender number
      const response = await fetch(`http://localhost:8080/get_previous_tender_data?current_tender_no=${formData.Tender_No}`);

      if (response.ok) {
        const data = await response.json();
        newMillCode = data.previous_tender_head_data.Mill_Code
        // Assuming setFormData is a function to update the form data
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...data.previous_tender_head_data,
        }));

        // Assuming setTenderDetails is a function to update the tender details
        setLastTenderDetails(data.previous_tender_details_data || []);
      } else {
        console.error("Failed to fetch previous tender data:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };


  //In utility page record doubleClicked that recod show for edit functionality
  const location = useLocation();
  const selectedRecord = location.state?.selectedRecord;
  console.log("editRecordData TenderHead", selectedRecord);

  useEffect(() => {
    if (selectedRecord) {
      handlerecordDoubleClicked();
    } else {
      handleAddOne();
    }
  }, [selectedRecord]);

  const handlerecordDoubleClicked = async () => {
    setIsEditing(false);
    setIsEditMode(false);
    setAddOneButtonEnabled(true);
    setEditButtonEnabled(true);
    setDeleteButtonEnabled(true);
    setBackButtonEnabled(true);
    setSaveButtonEnabled(false);
    setCancelButtonEnabled(false);
    setCancelButtonClicked(true);

    try {
      const response = await axios.get(`http://localhost:8080/get_tender_data_by_id?tenderid=${selectedRecord?.tenderid}`);
      if (response.status === 200) {
        const data = response.data;
        newMillCode = data.tender_head_data.Mill_Code
        newTenderId = data.tender_head_data.tenderid
        // Update form data with the last tender data
        setFormData(prevData => ({
          ...prevData,
          Tender_No: data.tender_head_data?.Tender_No || "",
          Tender_Date: data.tender_head_data?.Tender_Date || "",
          Mill_Code: newMillCode || "",
        }));

        setLastTenderData(data.tender_head_data || {});
        setLastTenderDetails(data.tender_details_data || []);
      } else {
        console.error("Failed to fetch last tender data:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  useEffect(() => {
    if (selectedRecord) {
      setUsers(
        lastTenderDetails.map((detail) => ({
          Buyer: detail.Buyer,
          Lifting_Date: detail.Lifting_Date,
          userId: detail.Bags,
          rowaction: "Normal",
          millCode: detail.Mill_Code,
          mc: detail.MC,
          id: detail.ID,
          tenderid: detail.tenderid,
          tenderdetailid: detail.tenderdetailid,
        }))
      );

    }
  }, [selectedRecord, lastTenderDetails]);

  useEffect(() => {
    setUsers(
      lastTenderDetails.map((detail) => ({
        Buyer: detail.Buyer,
        Lifting_Date: detail.Lifting_Date,
        userId: detail.Bags,
        rowaction: "Normal",
        millCode: detail.Mill_Code,
        mc: detail.MC,
        id: detail.ID,
        tenderid: detail.tenderid,
        tenderdetailid: detail.tenderdetailid,
      }))
    );
  }, [lastTenderDetails]);

//handle back to Utility page.
  const handleBack = () => {
    navigate("/")
  };

  //Head data functionality code.
  const [formData, setFormData] = useState({
    Tender_No: "",
    Tender_Date: "",
    Mill_Code: "",
  });

  // Handle changes in the TenderNo input
  const handleTenderNoChange = (event) => {
    setFormData({
      ...formData,
      Tender_No: event.target.value,
    });
  };

  // Handle changes in the Tender_Date input
  const handleTenderDateChange = (event) => {
    setFormData({
      ...formData,
      Tender_Date: event.target.value,
    });
  };

  // Handle form submission (you can modify this based on your needs)
  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform actions with formData, for example, send it to the server
    console.log("Form Data Submitted:", formData);
  };


  //detail data functionality code.
  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedUser({});
    clearForm();
  };

  const clearForm = () => {
    setName("");
    setLifting_Date("");
    setUserId("");
    setMillCode("");
  };

  const editUser = (user) => {
    setSelectedUser(user);
    setName(user.Buyer);
    setLifting_Date(user.Lifting_Date);
    setUserId(user.userId);
    setMillCode(user.millCode);
    openPopup();
  };

  const addUser = () => {

    const newUser = {
      id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
      Buyer,
      Lifting_Date,
      userId,
      millCode,
      mc,
      rowaction: "add",
    };

    setUsers([...users, newUser]);
    closePopup();
  };

  const updateUser = () => {
    const updatedUsers = users.map((user) => {
      if (user.id === selectedUser.id) {
        const updatedRowaction =
          user.rowaction === "Normal" ? "update" : user.rowaction;

        return {
          ...user,
          Buyer,
          Lifting_Date,
          userId,
          millCode,
          mc,
          rowaction: updatedRowaction,
          tenderid: newTenderId,
          tenderdetailid: user.tenderdetailid,
        };
      } else {
        return user;
      }
    });

    setUsers(updatedUsers);
    closePopup();
  };

  const deleteModeHandler = (user) => {
    if (isEditMode && user.rowaction === "add") {
      setDeleteMode(true);
      setSelectedUser(user);
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, rowaction: "DNU" } : u
      );
      setUsers(updatedUsers);
      setSelectedUser({});
    } else if (isEditMode) {
      setDeleteMode(true);
      setSelectedUser(user);
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, rowaction: "delete" } : u
      );
      setUsers(updatedUsers);
      setSelectedUser({});
    } else {
      setDeleteMode(true);
      setSelectedUser(user);
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, rowaction: "DNU" } : u
      );
      setUsers(updatedUsers);
      setSelectedUser({});
    }
  };

  const openDelete = (user) => {
    setDeleteMode(true);
    setSelectedUser(user);
    if (isEditMode && user.rowaction === "delete") {
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, rowaction: "Normal" } : u
      );
      setUsers(updatedUsers);
      setSelectedUser({});
    } else {
      setDeleteMode(false);
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, rowaction: "add" } : u
      );
      setUsers(updatedUsers);
      setSelectedUser({});
    }
  };


  const handleMillCode = (code, mc, label) => {
    setMillCode(code);
    setMc(mc);
    setLabel(label);
    console.log("+++++", code, mc, label);
  };

  // Handle changes in the Mill_Code input (assuming ApiMill_Code handles its own state)
  const handleMillCodeHead = (millCode) => {
    setMillCode(millCode);
    setFormData({
      ...formData,
      Mill_Code: millCode,
    });
    console.log("Mill_Code:", millCode);
  };

  return (
    <>
      {/* Action button  */}
      <div className="container">
        <ActionButtonGroup
          handleAddOne={handleAddOne}
          addOneButtonEnabled={addOneButtonEnabled}
          handleSaveOrUpdate={handleSaveOrUpdate}
          saveButtonEnabled={saveButtonEnabled}
          isEditMode={isEditMode}
          handleEdit={handleEdit}
          editButtonEnabled={editButtonEnabled}
          handleDelete={handleDelete}
          deleteButtonEnabled={deleteButtonEnabled}
          handleCancel={handleCancel}
          cancelButtonEnabled={cancelButtonEnabled}
          handleBack={handleBack}
          backButtonEnabled={backButtonEnabled}
        />
        <div>
          {/* Navigation Buttons */}
          <NavigationButtons
            handleFirstButtonClick={handleFirstButtonClick}
            handlePreviousButtonClick={handlePreviousButtonClick}
            handleNextButtonClick={handleNextButtonClick}
            handleLastButtonClick={handleLastButtonClick}
            highlightedButton={highlightedButton}
            isEditing={isEditing}
          />

        </div>
      </div>

      {/* Head Part */}
      <form className="d-flex container" onSubmit={handleSubmit}>
        <div className="d-flex align-items-center col-md-2">
          <label className="form-label">TenderNo:</label>
          <input
            type="text"
            className="form-control"
            name="Tender_No"
            autoComplete="off"
            value={formData.Tender_No}
            onChange={handleTenderNoChange}
            readOnly
          />
        </div>

        <div className="d-flex align-items-center ms-3">
          <label className="form-label">Tender_Date:</label>
          <input
            type="date"
            className="form-control"
            id="datePicker"
            min="2023-04-01"
            max="2024-03-31"
            name="Tender_Date"
            value={formData.Tender_Date}
            onChange={handleTenderDateChange}
            disabled={!isEditing}
          />
        </div>

        <div className="d-flex align-items-center ms-3">
          <label className="form-label">Mill Code:</label>
          <ApiMill_Code
            acType="M"
            companyCode={1}
            name="Mill_Code"
            onAcCodeClick={handleMillCodeHead}
            newMillCode={newMillCode}
          />
        </div>
      </form>

      {/*detail part */}
      <div className="container mt-4">
        <button
          className="btn btn-primary"
          onClick={openPopup}
          disabled={!isEditing}
        >
          Add New Detail
        </button>
        <button
          className="btn btn-danger"
          disabled={!isEditing}
          style={{ marginLeft: "10px" }}
        >
          Close
        </button>
        {showPopup && (
          <div
            className="modal"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectedUser.id ? "Edit User" : "Add User"}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={closePopup}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group col-md-4">
                      <label>Buyer:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={Buyer}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Date:</label>
                      <input
                        type="date"
                        className="form-control"
                        value={Lifting_Date}
                        onChange={(e) => setLifting_Date(e.target.value)}
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Bags:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                      />
                    </div>
                   
                    <label>Account help:</label>
                    <ApiMill_Code
                      acType="M"
                      companyCode={1}
                      name="Mill_Code"
                      onAcCodeClick={handleMillCode}
                      millcode={millCode}
                      mc={mc}
                      label={label}
                    />
                  </form>
                </div>
                <div className="modal-footer">
                  {selectedUser.id ? (
                    <button className="btn btn-primary" onClick={updateUser}>
                      Update User
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={addUser}>
                      Add User
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closePopup}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <table className="table mt-4 table-bordered">
          <thead>
            <tr>
              <th>Actions</th>
              <th>ID</th>
              <th>Buyer</th>
              <th>Date</th>
              <th>Bags</th>
              {/* <th>Rowaction</th> */}
              {/* <th>Mill Code</th> */}
              {/* <th>MC</th> */}
              <th>tenderdetailid</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  {user.rowaction === "add" ||
                    user.rowaction === "update" ||
                    user.rowaction === "Normal" ? (
                    <>
                      <button
                        className="btn btn-warning"
                        onClick={() => editUser(user)}
                        disabled={!isEditing}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger ms-2"
                        onClick={() => deleteModeHandler(user)}
                        disabled={!isEditing}
                      >
                        Delete
                      </button>
                    </>
                  ) : user.rowaction === "DNU" ||
                    user.rowaction === "delete" ? (
                    <button
                      className="btn btn-secondary"
                      onClick={() => openDelete(user)}
                    >
                      Open
                    </button>
                  ) : null}
                </td>

                <td>{user.id}</td>
                <td>{user.Buyer}</td>
                <td>{user.Lifting_Date}</td>
                <td>{user.userId}</td>
                {/* <td>{user.rowaction}</td> */}
                {/* <td>{user.millCode}</td> */}
                {/* <td>{user.mc}</td> */}
                <td>{user.tenderdetailid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserManagement;