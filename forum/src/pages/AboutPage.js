import React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import ComputerIcon from "@mui/icons-material/Computer";
import FunctionsIcon from "@mui/icons-material/Functions";
import WebIcon from "@mui/icons-material/Web";
import PageCard from "../components/PageCard";

const AboutPage = () => {
  return (
    <PageCard>
      <Typography variant="h4" component="h1" gutterBottom>
        About This Site
      </Typography>

      <Typography variant="h6" component="h2">
        Purpose
      </Typography>
      <Typography paragraph>
        This site serves as a collaborative platform for enthusiasts and
        students of mathematics and computer science. It aims to facilitate
        discussions, knowledge sharing, and problem-solving in these vibrant
        fields of study.
      </Typography>

      <Typography variant="h6" component="h2">
        Origins
      </Typography>
      <Typography paragraph>
        Developed as part of an academic assignment, this site showcases the
        practical application of theoretical concepts learned throughout the
        course. It is designed to bridge the gap between academic studies and
        real-world application.
      </Typography>

      <Typography variant="h6" component="h2">
        Technologies Used
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <WebIcon />
          </ListItemIcon>
          <ListItemText
            primary="React"
            secondary="A JavaScript library for building user interfaces"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ComputerIcon />
          </ListItemIcon>
          <ListItemText
            primary="Material UI"
            secondary="A popular React UI framework"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <FunctionsIcon />
          </ListItemIcon>
          <ListItemText
            primary="Python/Flask"
            secondary="A lightweight WSGI web application framework"
          />
        </ListItem>
      </List>
    </PageCard>
  );
};

export default AboutPage;
