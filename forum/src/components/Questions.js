import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Pagination,
  Paper,
} from "@mui/material";
import FakeQuestionService from "../services/FakeQuestionService";
import SearchQuestionForm from "./forms/SearchQuestionForm";
import QuestionsList from "./QuestionsList/QuestionsList";

const pageSize = 10; // Define how many questions to show per page

const tagsOptions = [
  { value: "programming", label: "programming" },
  { value: "machine learning", label: "machine learning" },
];

const QuestionsComponent = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState({ query: "", tags: [] });
  const questionService = new FakeQuestionService();

  const fetchQuestionCount = async () => {
    const total =
      await questionService.getNumberOfQuestionsMatching(searchParams);
    setTotalPages(Math.ceil(total / pageSize));
  };

  const fetchQuestions = async () => {
    setIsLoading(true);
    const questions = await questionService.search({
      ...searchParams,
      skip: (page - 1) * pageSize,
      limit: pageSize,
    });
    setIsLoading(false);
    window.scrollTo(0, 0);
    setQuestions(questions);
  };

  const handleSearch = async (values) => {
    setSearchParams({
      query: values.search,
      tags: values.tags.map((tag) => tag.value),
      sortBy: values.sortBy,
      sortOrder: values.sortOrder,
    });
    setPage(1);
  };

  useEffect(() => {
    fetchQuestionCount().then(() => {});
  }, [searchParams]);

  useEffect(() => {
    fetchQuestions().then(() => {});
  }, [page, searchParams]);

  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: 2 }}>
      <Paper sx={{ mb: 3, p: 4 }} elevation={24}>
        <SearchQuestionForm onSearch={handleSearch} popularTags={tagsOptions} />
      </Paper>
      <QuestionsList questions={questions} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Pagination
        count={totalPages}
        page={page}
        variant="outlined"
        color="primary"
        onChange={(e, value) => setPage(value)}
        sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
      />
    </Box>
  );
};

export default QuestionsComponent;
