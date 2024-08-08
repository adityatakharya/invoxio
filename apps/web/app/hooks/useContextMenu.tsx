import { useState } from 'react';

export function useContextMenu() {
    const [contextMenu, setContextMenu] = useState<{ show: boolean; x: number; y: number; message: any }>({ show: false, x: 0, y: 0, message: null });

    const handleContextMenu = (e: React.MouseEvent, message: string, side: String) => {
        e.preventDefault();
        setContextMenu({
            show: true,
            x: side === 'right' ? e.clientX - 120 : e.clientX,
            y: e.clientY,
            message
        });
    };

    const handleTouchStart = (e: React.TouchEvent, message: string, side: String) => {
        e.preventDefault();
        const touch = e.touches[0];
        if (touch) {
            setContextMenu({
                show: true,
                x: side === 'right' ? touch.clientX - 120 : touch.clientX,
                y: touch.clientY,
                message
            });
        }
    };

    const closeContextMenu = () => {
        setContextMenu({ show: false, x: 0, y: 0, message: null });
    };

    return { contextMenu, handleContextMenu, handleTouchStart, closeContextMenu };
}
