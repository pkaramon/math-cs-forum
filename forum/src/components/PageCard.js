import { Card, useMediaQuery, useTheme } from "@mui/material";
import Container from "@mui/material/Container";

const PageCard = ({ containerProps, paperProps, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Container
      maxWidth="md"
      sx={{ mt: { xs: 6, sm: 10 }, p: { xs: 0, sm: 2 } }}
      {...containerProps}
    >
      <Card
        elevation={isMobile ? 0 : 3}
        sx={{ p: { xs: 2, sm: 4 } }}
        {...paperProps}
      >
        {children}
      </Card>
    </Container>
  );
};
export default PageCard;
