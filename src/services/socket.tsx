import {io} from "socket.io-client";
import { Socket } from 'socket.io-client';
import {useEffect} from "react";

const socketEndpoint = process.env.REACT_APP_SOCKET_SERVER || "http://localhost:3001";

const getSocketConnection = () => {
    return io(socketEndpoint).connect();
}

const useSocketOnHook = (
    socket: Socket,
    eventName: string,
    handler: (data: any) => void,
): void => {
    useEffect(() => {
        socket.on(eventName, handler);

        // Cleanup on unmount
        return () => {
            socket.off(eventName, handler);
        };
    }, [eventName, handler, socket]);
};

export { getSocketConnection, useSocketOnHook }