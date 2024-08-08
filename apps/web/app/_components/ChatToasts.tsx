import React from "react";

interface ToastProps {
    notiText: string;
    show: boolean;
}

const SuccessToast: React.FC<ToastProps> = ({ notiText, show }) => {
    if (!show) return null;
    return (
        <div className="toast toast-start z-20 top-24 left-0">
            <div className="alert alert-success">
                <span>{notiText}</span>
            </div>
        </div>
    );
};

const ErrorToast: React.FC<ToastProps> = ({ notiText, show }) => {
    if (!show) return null;
    return (
        <div className="toast toast-start z-20 top-24 left-0">
            <div className="alert alert-error">
                <span>{notiText}</span>
            </div>
        </div>
    );
};

const WarningToast: React.FC<ToastProps> = ({ notiText, show }) => {
    if (!show) return null;
    return (
        <div className="toast toast-start z-20 top-24 left-0">
            <div className="alert alert-warning">
                <span>{notiText}</span>
            </div>
        </div>
    );
};

const InfoToast: React.FC<ToastProps> = ({ notiText, show }) => {
    if (!show) return null;
    return (
        <div className="toast toast-start z-20 top-24 left-0">
            <div className="alert alert-info">
                <span>{notiText}</span>
            </div>
        </div>
    );
};

export { SuccessToast, ErrorToast, WarningToast, InfoToast };
