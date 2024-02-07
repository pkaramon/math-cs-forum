import { createContext, useContext, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";

const ConfirmDialogContext = createContext({});

export const ConfirmDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    content: "",
    onAgree: () => {},
    onDisagree: () => {
      setOpen(false);
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const openModal = ({
    title,
    content,
    onAgree,
    onDisagree = () => {
      setOpen(false);
    },
  }) => {
    const onAgreeWithClose = async () => {
      await onAgree();
      setOpen(false);
    };

    setOpen(true);

    setModalData({ title, content, onAgree: onAgreeWithClose, onDisagree });
  };

  const value = { openModal };
  return (
    <ConfirmDialogContext.Provider value={value}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{modalData.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {modalData.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={modalData.onDisagree}>Cancel</Button>
          <Button onClick={modalData.onAgree} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      {children}
    </ConfirmDialogContext.Provider>
  );
};

const useConfirmDialog = () => {
  return useContext(ConfirmDialogContext);
};
export default useConfirmDialog;
