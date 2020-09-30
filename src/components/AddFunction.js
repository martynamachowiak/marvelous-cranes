import React, { useState } from "react";
import PropTypes from "prop-types";
import { Slider } from "@material-ui/core";

import axios from "axios";
import "../styles/AddFunction.css";

const AddFunction = ({ fields, setFields }) => {
  const [craneSlider, setCraneSlider] = useState(0);
  const [backgroundSlider, setBackgroundSlider] = useState(0);

  const handleAddCrane = (event) => {
    event.preventDefault();
    axios
      .post("https://test-crane.herokuapp.com/addCrane", fields)
      .then((response) => {
        console.log(response);
        alert(` ${response.data.craneCaption} successfully added`);
      })
      .catch((err) => {
        alert(` ${fields.craneCaption} could not be added - check console`);
        console.log(err);
      });
  };

  const handleFieldChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleCRSlider = (e, value) => {
    setCraneSlider(value);
    setFields({
      ...fields,
      craneRate: craneSlider,
    });
  };

  const handleBRSlider = (e, value) => {
    setBackgroundSlider(value);
    setFields({
      ...fields,
      craneBackgroundRate: backgroundSlider,
    });
  };

  return (
    <div className="add-function">
      <form id="addForm" className="add-crane-form" onSubmit={handleAddCrane}>
        <input
          id="craneCaption"
          name="craneCaption"
          placeholder="Caption"
          value={fields.craneCaption}
          onChange={handleFieldChange}
          required
          autoComplete="off"
        />
        <label htmlFor="craneRate">Crane Rate</label>

        <Slider
          id="craneRate"
          name="craneRate"
          value={craneSlider}
          min={0}
          max={10}
          step={0.1}
          marks={false}
          valueLabelDisplay="auto"
          onChange={handleCRSlider}
        />

        <label htmlFor="craneBackgroundRate">Background Rate</label>

        <Slider
          id="craneBackgroundRate"
          name="craneBackgroundRate"
          value={backgroundSlider}
          min={0}
          max={10}
          step={0.1}
          marks={false}
          valueLabelDisplay="auto"
          onChange={handleBRSlider}
        />

        <input
          id="craneDescription"
          name="craneDescription"
          placeholder="Comment"
          type="textarea"
          value={fields.craneDescription}
          onChange={handleFieldChange}
          required
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={fields.markers.length !== 1}
          className="add-crane-button"
        >
          ADD CRANE
        </button>
      </form>
    </div>
  );
};

AddFunction.propType = {
  fields: PropTypes.object.isRequired,
  setFields: PropTypes.func.isRequired,
};

export default AddFunction;
