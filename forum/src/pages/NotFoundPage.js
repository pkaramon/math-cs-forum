import NothingFound from "../components/NothingFound";
import { Box } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        mt: 10,
      }}
    >
      <NothingFound
        message={"Sorry, the page you are looking for could not be found."}
      />
    </Box>
  );
};
export default NotFoundPage;
