import React from "react";
import NavBar from "./NavBar";
import axios from "axios";
import "../styles/AddFunction.css";

const AddFunction = ({ fields, setFields }) => {

  const handleAddCrane = (event) => {
    event.preventDefault();
    axios
      .post("https://test-crane.herokuapp.com/addCrane", fields)
      .then((response) => {
        console.log(response);
        alert(` ${response.data.craneCaption} succesfully added`)
        {resetForm()}
      })
      .catch((err) => {
        alert(` ${fields.craneCaption} could not be added - check console`)
        console.log(err);
      });
  };
const resetForm = () => {
  console.log("test");
  document.getElementById("addForm").reset();
}
  const handleFieldChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  return (
    <div className="AddFunction">
      Add your crane
      <form id="addForm" onSubmit={handleAddCrane} >

          <input
            id="craneCaption"
            name="craneCaption"
            placeholder="Caption"
            value={fields.craneCaption}
            onChange={handleFieldChange}
            required
            autoComplete="off"
          />

          <input
            id="craneRate"
            name="craneRate"
            type="Number"
            placeholder="Crane rating"
            min={0}
            max={10}
            step={0.1}
            value={fields.craneRate}
            onChange={handleFieldChange}
            required
          />

          <input
            id="craneBackgroundRate"
            name="craneBackgroundRate"
            type="Number"
            placeholder="Background rating"
            min={0}
            max={10}
            step={0.1}
            value={fields.craneBackgroundRate}
            onChange={handleFieldChange}
            required
          />

          <input
            id="craneUser"
            name="craneUser"
            value={fields.craneUser}
            onChange={handleFieldChange}
            required
            disabled
          />

          <input
            id="craneDescription"
            name="craneDescription"
            placeholder="Comment"
            value={fields.craneDescription}
            onChange={handleFieldChange}
            required
            autoComplete="off"
          />
        
          <input 
            id="submitButton"
            type="submit"
            value="Add"
          />
      </form>
      <NavBar />
    </div>
  );
};

export default AddFunction;
