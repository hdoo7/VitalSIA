import ReactDOMClient from 'react-dom/client';
import ChatComponent from './components/ChatComponent';

let root = null;

export const start = (animationManager, appSettings, containerRef) => {
    if (!containerRef || !containerRef.current) {
        console.error('Invalid container reference');
        return;
    }

    if (!root) {
        root = ReactDOMClient.createRoot(containerRef.current);
    }

    root.render(<ChatComponent animationManager={animationManager} appSettings={appSettings} />);
};

export const stop = () => {
    if (root) {
        root.unmount();
        root = null;
    }
};