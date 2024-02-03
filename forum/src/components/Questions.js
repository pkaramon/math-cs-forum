import React, { useEffect, useState } from "react";
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

// Assuming you have a predefined list of tags and sort options
const sortOptions = [
  { value: "addedAt", label: "Added Date" },
  { value: "modifiedAt", label: "Modified Date" },
];

const pageSize = 10; // Define how many items per page you want

const QuestionsComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [query, setQuery] = useState("");
  const [tags, setTags] = useState([]);
  const [sortBy, setSortBy] = useState("addedAt");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const questionService = new FakeQuestionService();

  const fetchQuestionCount = async () => {
    const total = await questionService.getNumberOfQuestionsMatching({
      query,
      tags,
    });
    console.log(total);
    setTotalPages(Math.ceil(total / pageSize));
    setPage(1);
  };

  const fetchQuestions = async () => {
    const questions = await questionService.search({
      query,
      tags,
      sortBy,
      sortOrder,
      skip: (page - 1) * pageSize,
      limit: pageSize,
    });
    setQuestions(questions);
  };

  useEffect(() => {
    fetchQuestionCount().then(() => {});
  }, [query, tags]);

  useEffect(() => {
    fetchQuestions().then(() => {});
  }, [page, query, tags, sortBy, sortOrder]);

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: 2 }}>
      <Formik
        onSubmit={(values) => {
          setQuery(values.search);
          setPage(1);
        }}
        initialValues={{ search: " " }}
      >
        <Form>
          <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
            <FormField property="search" label="Search" variant="outlined" />
            <Button type="submit" variant="contained">
              Search
            </Button>
          </Box>
        </Form>
      </Formik>
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Order</InputLabel>
          <Select
            value={sortOrder}
            label="Order"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
        {/* Add Tag Selection UI Here */}
      </Box>
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
