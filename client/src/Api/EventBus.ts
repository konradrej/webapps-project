/**
 * Contains an event bus where listeners can register for certain events.
 */

class Eventbus {
  private id: number = 0;
  private listeners: { [event: string]: { [id: number]: CallableFunction } } = {};

  trigger(event: string, payload: any) {
    if (this.listeners[event]) {
      Object.values(this.listeners[event]).forEach((fn) => {
        fn(payload);
      })
    }
  }

  addListener(event: string, fn: CallableFunction): number {
    let id = this.id++
    if(!this.listeners[event]){
      this.listeners[event] = {};
    }
    this.listeners[event][id] = fn;
    return id;
  }

  removeListener(event: string, id: number): boolean {
    if (this.listeners[event][id]) {
      delete this.listeners[event][id];
      return true;
    }
    return false;
  }
}

export default new Eventbus();