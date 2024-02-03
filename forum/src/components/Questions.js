import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";
import FakeQuestionService from "../services/FakeQuestionService";
import QuestionsList from "./QuestionsList/QuestionsList";
import { Form, Formik } from "formik";
import FormField from "./forms/FormField";

const sortOptions = [
  { value: "addedAt", label: "Added Date" },
  { value: "modifiedAt", label: "Modified Date" },
];

const pageSize = 10; // Define how many items per page you want

const QuestionsComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const questionService = new FakeQuestionService();

  const fetchQuestionCount = async ({ query, tags }) => {
    const total = await questionService.getNumberOfQuestionsMatching({
      query,
      tags,
    });
    console.log(total);
    setTotalPages(Math.ceil(total / pageSize));
  };

  const fetchQuestions = async (searchObj) => {
    const questions = await questionService.search({
      ...searchObj,
      skip: (page - 1) * pageSize,
      limit: pageSize,
    });
    setQuestions(questions);
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: 2 }}>
      <Formik
        onSubmit={async (values) => {
          setPage(1);
        }}
        initialValues={{
          search: " ",
          tags: [],
          sortBy: "addedAt",
          sortOrder: "asc",
        }}
      >
        {({}) => (
          <>
            <Form>
              <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
                <FormField
                  property="search"
                  label="Search"
                  variant="outlined"
                />
                <Button type="submit" variant="contained">
                  Search
                </Button>
              </Box>
            </Form>
            <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <FormField property={"sortBy"} label="Sort By" as={Select}>
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </FormField>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Order</InputLabel>
                <FormField property={"sortOrder"} label="Order" as={Select}>
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </FormField>
              </FormControl>
              {/* Add Tag Selection UI Here */}
            </Box>
          </>
        )}
      </Formik>

      <QuestionsList questions={questions} />
      <Pagination
        count={totalPages}
        page={page}
        onChange={(e, value) => setPage(value)}
        sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
      />
    </Box>
  );
};

export default QuestionsComponent;
