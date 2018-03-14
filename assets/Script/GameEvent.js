var gameEvents = {}

gameEvents.EVENT_ROTATE_LEFT = "rotate_left";
gameEvents.EVENT_ROTATE_RIGHT = "rotate_right";

gameEvents.MAP_EMPTY = 0;
gameEvents.MAP_STATIC = 1;
gameEvents.MAP_MOVE = 2;
gameEvents.MAP_PLAYER = 3;
gameEvents.MAP_TARGET = 4;

module.exports = gameEvents;