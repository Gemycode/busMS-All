import { io } from 'socket.io-client';
import { store } from '../redux/store';
import { setSocketConnected, updateBusLocation } from '../redux/trackingSlice';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket && this.isConnected) {
      return;
    }

    this.socket = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to tracking server');
      this.isConnected = true;
      store.dispatch(setSocketConnected(true));
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from tracking server');
      this.isConnected = false;
      store.dispatch(setSocketConnected(false));
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
      store.dispatch(setSocketConnected(false));
    });

    // Listen for bus location updates
    this.socket.on('bus-location-update', (data) => {
      console.log('Received bus location update:', data);
      store.dispatch(updateBusLocation({
        busId: data.busId,
        location: data.location
      }));
    });

    // Listen for route bus updates
    this.socket.on('route-bus-update', (data) => {
      console.log('Received route bus update:', data);
      store.dispatch(updateBusLocation({
        busId: data.busId,
        location: data.location
      }));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      store.dispatch(setSocketConnected(false));
    }
  }

  joinBusTracking(busId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-bus-tracking', busId);
      console.log(`Joined bus tracking for bus ${busId}`);
    }
  }

  joinRouteTracking(routeId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-route-tracking', routeId);
      console.log(`Joined route tracking for route ${routeId}`);
    }
  }

  leaveTracking() {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-tracking');
      console.log('Left tracking rooms');
    }
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService; 