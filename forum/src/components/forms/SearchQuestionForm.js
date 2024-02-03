import React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import SearchQuestionSchema, {
  initialValues,
  sortOptions,
  sortOrderOptions,
} from "./SearchQuestionSchema";
import FormField from "./FormField";
import TagsField from "./TagsField";

const SearchQuestionForm = ({ onSearch, popularTags }) => {
  return (
    <Formik
      onSubmit={(values) => {
        onSearch(values);
      }}
      initialValues={initialValues}
      validationSchema={SearchQuestionSchema}
    >
      {({ dirty, isValid }) => (
        <Form>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              marginBottom: 2,
              alignItems: "baseline",
            }}
          >
            <FormField property="search" label="Search" variant="outlined" />
            <Button
              type="submit"
              variant="contained"
              sx={{ height: 56 }}
              disabled={!isValid || !dirty}
            >
              Search
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Field name={"sortBy"} label="Sort By" as={Select}>
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Order</InputLabel>
              <Field name={"sortOrder"} label="Order" as={Select}>
                {sortOrderOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
            </FormControl>
          </Box>

          <Box>
            <TagsField
              name="tags"
              options={popularTags}
              label="Select Tags"
              placeholder="Start typing to search tags..."
              fullWidth
            />
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default SearchQuestionForm;
