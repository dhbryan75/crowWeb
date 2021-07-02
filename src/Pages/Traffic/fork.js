import { RoadInfo, CarGenInfo, ControlInfo, ConnInfo } from "./TrafficInfo";

export var roadInfos = [
    new RoadInfo(
        -400, -100, 
        -900, -100, 
        0, 
        2,
        90, 
        8,
        40,
        2,
    ),
    new RoadInfo(
        -900, 0, 
        -400, 0,
        0, 
        2,
        90,
        8,
        40,
        2,
    ),
    new RoadInfo(
        400, -700, 
        0, -300, 
        0, 
        2, 
        90, 
        8,
        40,
        2,
    ),
    new RoadInfo(
        100, -200, 
        500, -600, 
        0, 
        2, 
        90, 
        8,
        40,
        2,
    ),
    new RoadInfo(
        -100, 200, 
        -100, 800, 
        0, 
        2, 
        90, 
        8,
        40,
        2,
    ),
    new RoadInfo(
        0, 800, 
        0, 200, 
        0, 
        2, 
        90, 
        8,
        40,
        2,
    ),
];

export var connInfos = [
    new ConnInfo(
        roadInfos[1].laneInfos[0], 
        roadInfos[3].laneInfos[0],
    ),
    new ConnInfo(
        roadInfos[1].laneInfos[1], 
        roadInfos[4].laneInfos[1],
    ),
    new ConnInfo(
        roadInfos[2].laneInfos[0], 
        roadInfos[4].laneInfos[0],
    ),
    new ConnInfo(
        roadInfos[2].laneInfos[1], 
        roadInfos[0].laneInfos[1],
    ),
    new ConnInfo(
        roadInfos[5].laneInfos[0], 
        roadInfos[0].laneInfos[0],
    ),
    new ConnInfo(
        roadInfos[5].laneInfos[1], 
        roadInfos[3].laneInfos[1],
    ),
];

export var carInfos = [];

export var controlInfos = [
    new ControlInfo(
        connInfos[0],
        0,
        900,
        0,
        640,
    ),
    new ControlInfo(
        connInfos[2],
        0,
        900,
        300,
        640,
    ),
    new ControlInfo(
        connInfos[4],
        0,
        900,
        600,
        640,
    ),
];

export var carGenInfos = [
    new CarGenInfo(
        roadInfos[1].laneInfos[0],
        0.01,
    ),
    new CarGenInfo(
        roadInfos[1].laneInfos[1],
        0.01,
    ),
    new CarGenInfo(
        roadInfos[2].laneInfos[0],
        0.01,
    ),
    new CarGenInfo(
        roadInfos[2].laneInfos[1],
        0.01,
    ),
    new CarGenInfo(
        roadInfos[5].laneInfos[0],
        0.01,
    ),
    new CarGenInfo(
        roadInfos[5].laneInfos[1],
        0.01,
    ),
];
