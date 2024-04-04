import { ServerInstance } from "../../server";
import SocketManager from "./socket.manager";

export const socketInstance = new SocketManager(ServerInstance);
