import io from "socket.io-client";
import config from "../config";

export const socket =io(`ws://${config.IP}:3004`)