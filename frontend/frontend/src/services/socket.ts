let socket: WebSocket | null = null;
const pendingMessages: string[] = [];
const listeners = new Set<(msg: any) => void>();

function flushPendingMessages() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  while (pendingMessages.length > 0) {
    const message = pendingMessages.shift()!;
    socket.send(message);
  }
}

function createSocket(token: string) {
  if (socket && socket.readyState !== WebSocket.CLOSED && socket.readyState !== WebSocket.CLOSING) {
    return socket;
  }

  socket = new WebSocket(`ws://localhost:4000?token=${token}`);

  socket.onopen = () => {
    console.log("Websocket is connected");
    flushPendingMessages();
  };

  socket.onmessage = (event) => {
    let msg;
    try {
      msg = JSON.parse(event.data);
    } catch (error) {
      console.error("Failed to parse websocket message:", error);
      return;
    }

    listeners.forEach((listener) => listener(msg));
  };

  socket.onclose = () => {
    console.log("WebSocket disconnected");
    socket = null;
  };

  socket.onerror = (err) => {
    console.error("WebSocket error:", err);
  };

  return socket;
}

function sendWebSocketMessage(payload: unknown) {
  const message = JSON.stringify(payload);
  const token = localStorage.getItem("token") ?? "";
  const ws = createSocket(token);

  if (ws.readyState === WebSocket.OPEN) {
    ws.send(message);
  } else {
    pendingMessages.push(message);
  }
}

export function connectionSocket(token: string) {
  return createSocket(token);
}

export function subscribeToMarket(market: string) {
  sendWebSocketMessage({
    type: "subscribe",
    roomId: market,
  });
}

export function unsubscribeFromMarket(market: string) {
  sendWebSocketMessage({
    type: "unsubscribe",
    roomId: market,
  });
}

export function addSocketListener(listener: (msg: any) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSocket() {
  return socket;
}
