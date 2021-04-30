import Dialog from '@material-ui/core/Dialog'
import Button from 'src/components/Button'

const ConfirmDialog = ({ open, onClose, message, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <div className="bg-gray-100 max-w-3xl rounded-lg shadow-lg">
        <div className="p-4">
          <span className="text-gray-600 text-center">{message}</span>
          <div className="flex gap-4">
            <Button
              className="mt-4 ml-auto shadow-md hover:shadow-lg bg-indigo-200 relative z-20"
              shouldAnimateHover
              iconName={'save'}
              onClick={onClose}
            >
              Don't delete
            </Button>
            <Button
              className="mt-4 ml-auto shadow-md hover:shadow-lg bg-red-200 relative z-20"
              shouldAnimateHover
              iconName={'trash'}
              onClick={() => {
                onClose()
                onConfirm()
              }}
              type="danger"
            >
              Yes, Delete
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ConfirmDialog
