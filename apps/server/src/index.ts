import http from "http";
import SocketService from "./services/socket";
import { startConsumer } from "./services/kafka";

async function init(){
    startConsumer();
    const socketservice = new SocketService();
    const httpServer = http.createServer();
    const PORT = process.env.PORT ? process.env.PORT : 8000;
    socketservice.io.attach(httpServer);

    httpServer.listen(PORT, () => console.log(`HTTP Server Started at PORT:${PORT}`));

    socketservice.initListeners(); 
}

init();