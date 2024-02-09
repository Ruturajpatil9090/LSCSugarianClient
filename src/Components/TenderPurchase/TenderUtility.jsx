// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import Pagination from "../UtilityCommon/Pagination";
// import SearchBar from "../UtilityCommon/SearchBar";
// import PerPageSelect from "../UtilityCommon/PerPageSelect";
// import "../../App.css";
// import axios from "axios";



// function TenderPurchaseUtility() {
//   const [fetchedData, setFetchedData] = useState([]);
//   const [filteredData, setFilteredData] = useState([]);
//   const [perPage, setPerPage] = useState(15);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [filterValue, setFilterValue] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const apiUrl = 'http://localhost:5000/groupmaster/getutilitydata';
//         const response = await axios.get(apiUrl);
//         setFetchedData(response.data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const filtered = fetchedData.filter(post => {
//       const searchTermLower = searchTerm.toLowerCase();
//       const millshortnameLower = (post.millshortname || '').toLowerCase(); 
  
//       return (
//         (filterValue === "" || post.group_Type === filterValue) &&
//         (millshortnameLower.includes(searchTermLower))
//       );
//     });
  
//     setFilteredData(filtered);
//     setCurrentPage(1); // Reset current page when the filter changes
//   }, [searchTerm, filterValue, fetchedData]);
  

  
//   const handlePerPageChange = (event) => {
//     setPerPage(event.target.value);
//     setCurrentPage(1);
//   };

//   const handleSearchTermChange = (event) => {
//     const term = event.target.value;
//     setSearchTerm(term);
//   };
  
//   const pageCount = Math.ceil(filteredData.length / perPage);

//   const paginatedPosts = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);


//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const handleClick = () => {
//     navigate("/business/tender_purchase");
//   };

//   const handleRowClick = (Tender_No) => {
//     navigate("/business/tender_purchase", { state: { editRecordCode: Tender_No } });
//   };

//   const handleSearchClick = () => {
//     setFilterValue("");
//   };

//   return (
//     <div className="App">
//       <Button variant="contained" onClick={handleClick}>
//         ADD
//       </Button>
//       <br></br>
//       <br></br>

//       <div className="controls" style={{ float: "left", width: "150px" }}>
//         {/* <FormControl>
//           <InputLabel id="filterSelect-label">Filter by Type:</InputLabel>
//           <Select
//             labelId="filterSelect-label"
//             id="filterSelect"
//             value={filterValue}
//             onChange={(e) => setFilterValue(e.target.value)}
//             style={{ marginLeft: "150px", alignItems: "center" }}
//           >
//             <MenuItem value="">Select Group_Type</MenuItem>
//             <MenuItem value="T">Type T</MenuItem>
//             <MenuItem value="B">Type B</MenuItem>
//             <MenuItem value="P">Type P</MenuItem>
//           </Select>
//         </FormControl> */}
//       </div>
//       <SearchBar
//         value={searchTerm}
//         onChange={handleSearchTermChange}
//         onSearchClick={handleSearchClick}
//       />
//       <PerPageSelect value={perPage} onChange={handlePerPageChange} />
//       <TableContainer>
//         <h1>Posts Table</h1>
//         <Table className="post-table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Tender No</TableCell>
//               <TableCell>Tender Date</TableCell>
//               <TableCell>Mill Short Name</TableCell>
//               <TableCell>Quantal</TableCell>
//               <TableCell>Grade</TableCell>
//               <TableCell>Mill Rate</TableCell>
//               <TableCell>Payment To Name</TableCell>
//               <TableCell>Tender do Name</TableCell>
//               <TableCell>season</TableCell>
//               <TableCell>Broker Short Name</TableCell>
//               <TableCell>Lifting Date</TableCell>
//               <TableCell>tenderid</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedPosts.map((post) => (
//               <TableRow
//                 key={post.RowNumber}
//                 className="row-item"
//                 onDoubleClick={() => handleRowClick(post.RowNumber)}
//               >
//                 <TableCell>{post.Tender_No}</TableCell>
//                 <TableCell>{post.Tender_Date}</TableCell>
//                 <TableCell>{post.millshortname}</TableCell>
//                 <TableCell>{post.Quantal}</TableCell>
//                 <TableCell>{post.Grade}</TableCell>
//                 <TableCell>{post.Mill_Rate}</TableCell>
//                 <TableCell>{post.paymenttoname}</TableCell>
//                 <TableCell>{post.tenderdoname}</TableCell>
//                 <TableCell>{post.season}</TableCell>
//                 <TableCell>{post.brokershortname}</TableCell>
//                 <TableCell>{post.Lifting_Date}</TableCell>
//                 <TableCell>{post.tenderid}</TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <Pagination
//         pageCount={pageCount}
//         currentPage={currentPage}
//         onPageChange={handlePageChange}
//       />
//     </div>
//   );
// }

// export default TenderPurchaseUtility;
