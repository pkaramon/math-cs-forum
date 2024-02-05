import React from "react";
import { useFormikContext } from "formik";
import { Autocomplete, Chip, TextField } from "@mui/material";

const TagsField = ({ name, options, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();

  return (
    <Autocomplete
      multiple
      freeSolo
      options={options}
      getOptionLabel={(option) => option.label || option}
      onChange={(event, newValue) => {
        const valueWithObjects = newValue.map((item) => {
          if (typeof item === "string") {
            const existingOption = options.find(
              (option) => option.label === item,
            );
            return existingOption || { value: item.toLowerCase(), label: item };
          }
          return item;
        });
        setFieldValue(name, valueWithObjects).then(() => {});
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            variant="outlined"
            label={option.label || option}
            {...getTagProps({ index })}
          />
        ))
      }
      renderInput={(params) => <TextField {...params} {...otherProps} />}
    />
  );
};

export default TagsField;
