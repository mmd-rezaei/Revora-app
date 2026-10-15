"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import RevoraButton from "@/components/ui/RevoraButton";

type SaveBuildDialogProps = {
  open: boolean;
  buildName: string;
  saving: boolean;
  error?: boolean;
  onClose: () => void;
  onNameChange: (name: string) => void;
  onSave: () => void;
};

export default function SaveBuildDialog({
  open,
  buildName,
  saving,
  error,
  onClose,
  onNameChange,
  onSave,
}: SaveBuildDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" aria-labelledby="save-build-title">
      <DialogTitle id="save-build-title">Save build to garage</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Build name"
          value={buildName}
          onChange={(e) => onNameChange(e.target.value)}
          margin="dense"
          error={error}
          helperText={error ? "Could not save — check your connection and sign-in." : "Minimum 2 characters"}
        />
      </DialogContent>
      <DialogActions>
        <RevoraButton onClick={onClose}>Cancel</RevoraButton>
        <RevoraButton variant="contained" onClick={onSave} disabled={saving || buildName.length < 2}>
          {saving ? "Saving…" : "Save"}
        </RevoraButton>
      </DialogActions>
    </Dialog>
  );
}
