import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Box, Button, Grid, useTheme } from "@mui/material";
import React, { useState } from "react";
import MarkdownEditor from "../components/MarkdownEditor";
import RenderMarkdown from "../components/RenderMarkdown";
import { markdownSample } from "../components/sampledata";

function Layout() {
  const theme = useTheme();
  const mainBoxStyles = {
    width: "100%",
    marginTop: { md: 8, sm: 3 }, // Default AppBar height for Material UI
  };
  const [markdown, setMarkdown] = useState(markdownSample);
  const [displayedMarkdown, setDisplayedMarkdown] = useState(markdown);

  return (
    <>
      <Navbar />
      <Box component="main" sx={mainBoxStyles}>
        <Outlet />
      </Box>

      <div>
        <Grid container sx={{ display: "flex" }}>
          <Grid item>
            <MarkdownEditor
              initial={markdown}
              onContentChange={(content) => setMarkdown(content)}
            />
            <Button
              variant="contained"
              onClick={() => setDisplayedMarkdown(markdown)}
            >
              Render
            </Button>
          </Grid>
          <Grid item sx={{ minWidth: "700px" }}>
            <RenderMarkdown markdown={displayedMarkdown} />
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default Layout;
