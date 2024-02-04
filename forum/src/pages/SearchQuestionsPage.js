import React, { useEffect, useRef, useState } from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Pagination,
  Paper,
} from "@mui/material";
import FakeQuestionService from "../services/FakeQuestionService";
import SearchQuestionForm from "../components/forms/SearchQuestionForm";
import QuestionsList from "../components/QuestionsList/QuestionsList";
import NothingFound from "../components/NothingFound";
import { initialValues as initialSearchParams } from "../components/forms/SearchQuestionSchema";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "qs";

const SearchQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchParams, setSearchParams] = useState(initialSearchParams);
  const questionService = new FakeQuestionService();
  const formikRef = useRef();

  const location = useLocation();
  const navigate = useNavigate();

  const fetchQuestionCount = async () => {
    const total =
      await questionService.getNumberOfQuestionsMatching(searchParams);
    setTotalPages(Math.ceil(total / PAGE_SIZE));
  };

  const fetchQuestions = async () => {
    setIsLoading(true);
    const questions = await questionService.search({
      ...searchParams,
      skip: (page - 1) * PAGE_SIZE,
      limit: PAGE_SIZE,
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

    const queryString = qs.stringify({
      search: values.search,
      tags: values.tags.map((tag) => tag.value).join(","),
      sortBy: values.sortBy,
      sortOrder: values.sortOrder,
    });

    navigate(`/search?${queryString}`);
    setPage(1);
  };

  useEffect(() => {
    fetchQuestionCount().then(() => {});
  }, [searchParams]);

  useEffect(() => {
    fetchQuestions().then(() => {});
  }, [page, searchParams]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get("search") || initialSearchParams.search;
    const tags =
      queryParams
        .get("tags")
        ?.split(",")
        ?.map((tag) => ({ value: tag, label: tag })) ||
      initialSearchParams.tags;
    const sortBy = queryParams.get("sortBy") || initialSearchParams.sortBy;
    const sortOrder =
      queryParams.get("sortOrder") || initialSearchParams.sortOrder;

    const searchParams = {
      search,
      tags,
      sortBy,
      sortOrder,
    };
    formikRef.current.setValues(searchParams);
    handleSearch(searchParams).then(() => {});
  }, [location.search]);

  const someQuestionsFound = questions.length > 0;
  return (
    <Box sx={{ maxWidth: "800px", margin: "auto", padding: 2 }}>
      <Paper sx={{ mb: 3, p: 4 }} elevation={24}>
        <SearchQuestionForm
          onSearch={handleSearch}
          popularTags={TAG_OPTIONS}
          formikRef={formikRef}
        />
      </Paper>
      <QuestionsList questions={questions} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {someQuestionsFound && (
        <Pagination
          count={totalPages}
          page={page}
          variant="outlined"
          color="primary"
          onChange={(e, value) => setPage(value)}
          sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
        />
      )}
      {!someQuestionsFound && !isLoading && (
        <NothingFound
          message={
            "No results found. Maybe try changing your query, or use more general terms."
          }
        />
      )}
    </Box>
  );
};

export default SearchQuestionsPage;

const PAGE_SIZE = 10;
const TAG_OPTIONS = [
  { value: "programming", label: "programming" },
  { value: "machine learning", label: "machine learning" },
];
