import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "../routes";

const AlertDialog = ({ onAgree, onDisagree, title, text }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  if (!onAgree) {
    onAgree = () => {
      navigate(routes.login, { state: { from: location }, replace: true });
    };
  }
  if (!onDisagree) {
    onDisagree = () => {
      navigate(-1);
    };
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onDisagree();
            handleClose();
          }}
        >
          Disagree
        </Button>
        <Button
          onClick={() => {
            onAgree();
            handleClose();
          }}
          autoFocus
          variant={"contained"}
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
