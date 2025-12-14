import Modal from './Modal';
import SecondaryButton from './SecondaryButton';
import PrimaryButton from './PrimaryButton';
import DangerButton from './DangerButton';

const ConfirmationModal = ({
    show,
    title,
    message,
    confirmLabel,
    processingLabel,
    variant = 'primary',
    processing = false,
    onConfirm,
    onCancel,
}) => {
    const ConfirmButton = variant === 'danger' ? DangerButton : PrimaryButton;

    return (
        <Modal show={show} onClose={onCancel} closeable={!processing}>
            <div className="p-6">
                {title && (
                    <h2 className="text-lg font-semibold text-white">
                        {title}
                    </h2>
                )}
                {message && (
                    <p className="mt-2 text-sm text-gray-400">
                        {message}
                    </p>
                )}
                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onCancel} disabled={processing}>
                        Cancel
                    </SecondaryButton>
                    <ConfirmButton onClick={onConfirm} disabled={processing}>
                        {processing ? processingLabel || confirmLabel : confirmLabel}
                    </ConfirmButton>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;
