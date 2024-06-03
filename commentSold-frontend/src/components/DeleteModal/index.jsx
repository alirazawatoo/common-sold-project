import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@mui/material'

const DeleteModal = ({
  show, itemName, onConfirm, onCancel, busy = false,
}) => (
  <Dialog open={show} onClose={busy ? undefined : onCancel} aria-labelledby='delete-dialog-title'>
    <DialogTitle id='delete-dialog-title'>Delete {itemName || 'this item'}?</DialogTitle>
    <DialogContent>
      <DialogContentText>
        This removes the product and its stock rows. Products that have orders cannot be deleted.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} disabled={busy}>Keep it</Button>
      <Button onClick={onConfirm} disabled={busy} color='error' variant='contained'>
        {busy ? 'Deleting...' : 'Delete'}
      </Button>
    </DialogActions>
  </Dialog>
)

export default DeleteModal
