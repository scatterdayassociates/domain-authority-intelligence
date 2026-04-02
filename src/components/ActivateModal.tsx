interface ActivateModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ActivateModal = ({ open, onClose, onConfirm }: ActivateModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="relative bg-background rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
        <h3 className="text-base font-semibold text-foreground">Activate Prompt Pack</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This will lock the current prompt set for execution. You'll need to deactivate before making edits.
        </p>
        <div className="flex justify-end gap-2.5 mt-6">
          <button
            onClick={onClose}
            className="h-8 px-3 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-8 px-4 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
          >
            Confirm & Activate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivateModal;
