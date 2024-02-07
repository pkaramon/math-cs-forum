import { createContext, useState } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { Button } from "@mui/material";
import Dialog from "@mui/material/Dialog";

export default function useConfirmDialog() {
  const [open, setOpen] = useState(true);

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

  const ModalComponent = () => {
    console.log("re render");
    return (
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
    );
  };

  return {
    openModal: ({
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
    },
    ModalComponent,
  };
}
