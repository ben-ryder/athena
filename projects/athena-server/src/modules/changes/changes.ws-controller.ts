import {OnSocketEvent, WebSocketController} from "../../../../../../kangojs/kangojs/packages/core";
import {ChangesService} from "./changes.service";
import {ChangeRequest} from "@ben-ryder/athena-js-lib";
import {
  OnSocketConnection
} from "@kangojs/core";
import {Socket, Server} from "socket.io";
import {TokenService} from "../../services/token/token.service";

// todo: add to js-lib
export enum ChangesSocketEvents {
  change = "change"
}

@WebSocketController()
class ChangesWebSocketController {
  constructor(
    private changesService: ChangesService,
    private tokenService: TokenService
  ) {}

  async getUserIdFromSocket(socket: Socket): Promise<string> {
    const accessToken = socket.handshake.auth.accessToken;
    if (accessToken) {
      const payload = await this.tokenService.validateAndDecodeAccessToken(accessToken);
      if (payload) {
        return payload.userId;
      }
    }

    throw new Error("Access Denied");
    // todo: handle failed decoding or no access token?
    // There is already the auth middleware that should be run so an access
    // token should always be present by this point. is this assumption right?
  }

  @OnSocketConnection()
  async onConnection(socket: Socket) {
    const userId = await this.getUserIdFromSocket(socket);
    socket.join(userId);
  }

  @OnSocketEvent({
    event: ChangesSocketEvents.change,
    dataShape: ChangeRequest
  })
  async onChange(socket: Socket, io: Server, payload: ChangeRequest, callback: () => void) {
    const userId = await this.getUserIdFromSocket(socket);

    // Immediately emit the change for other connected clients
    socket.to(userId).emit(ChangesSocketEvents.change, payload);

    // Add the change to the database
    await this.changesService.add(userId, [payload])
  }
}