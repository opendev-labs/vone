import React, { useEffect, useState } from 'react';
import QvenvApp from './App';

const QvenvWrapper: React.FC = () => {
    // We need to ensure that when we are in the Qvenv wrapper, we handle its internal routing
    // while being integrated into the main Void hash router.

    // Qvenv uses window.location.hash internally. 
    // We might need to sync the main app's route or just let Qvenv handle it if we are on #/qvenv

    return (
        <div className="h-[calc(100vh-140px)] rounded-3xl overflow-hidden glass-panel border-white/[0.08] relative">
            <QvenvApp />
        </div>
    );
};

export default QvenvWrapper;
