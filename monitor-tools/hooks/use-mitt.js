import mitt from '../libs/mitt.ts';
import {onBeforeUnmount} from "vue";
export function useMitt() {

  const emitter = mitt();


  const offEvents = (events = {}) => {
    for (const eventType in events) {
      emitter.off(eventType, events[eventType])
    }
  }


  const onEvents = (events = {}, isInComponentCall = false) => {
    for (const eventType in events) {
      emitter.on(eventType, events[eventType])
    }

    if (isInComponentCall) {
      onBeforeUnmount(() => offEvents(events))
    }
  }

  const onEvent = (eventType, handler, isInComponentCall = false) => {
    onEvents({
      [eventType]: handler
    }, isInComponentCall)
  }


  return {
    emitter,
    onEvents,
    offEvents,
    onEvent,
    emit: emitter.emit,
  }
}

