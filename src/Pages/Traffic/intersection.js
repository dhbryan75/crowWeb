import { RoadInfo, CarGenInfo, ControlInfo, ConnInfo } from "./TrafficInfo";


export var roadInfos = [
    new RoadInfo(
        300, 100, 
        1200, 100, 
        0, 
        4,
        90,
    ),
    new RoadInfo(
        1200, -100, 
        300, -100,
        0, 
        4,
        90,
    ),
    new RoadInfo(
        100, -300, 
        100, -800, 
        0, 
        4,
        90,
    ),
    new RoadInfo(
        -100, -800, 
        -100, -300,
        0, 
        4,
        90,
    ),
    new RoadInfo(
        -300, -100, 
        -1200, -100, 
        0, 
        4,
        90,
    ),
    new RoadInfo(
        -1200, 100, 
        -300, 100,
        0, 
        4,
        90,
    ),
    new RoadInfo(
        -100, 300, 
        -100, 800, 
        0, 
        4,
        90,
    ),
    new RoadInfo(
        100, 800, 
        100, 300,
        0, 
        4,
        90,
    ),
];

export var connInfos = [
    new ConnInfo(//0
        roadInfos[1].laneInfos[0], 
        roadInfos[6].laneInfos[0],
    ),
    new ConnInfo(//1
        roadInfos[1].laneInfos[1], 
        roadInfos[4].laneInfos[1],
    ),
    new ConnInfo(//2
        roadInfos[1].laneInfos[2], 
        roadInfos[4].laneInfos[2],
    ),
    new ConnInfo(//3
        roadInfos[1].laneInfos[3], 
        roadInfos[4].laneInfos[3],
    ),
    new ConnInfo(//4
        roadInfos[1].laneInfos[3], 
        roadInfos[2].laneInfos[3],
    ),

    new ConnInfo(//5
        roadInfos[3].laneInfos[0], 
        roadInfos[0].laneInfos[0],
    ),
    new ConnInfo(//6
        roadInfos[3].laneInfos[1], 
        roadInfos[6].laneInfos[1],
    ),
    new ConnInfo(//7
        roadInfos[3].laneInfos[2], 
        roadInfos[6].laneInfos[2],
    ),
    new ConnInfo(//8
        roadInfos[3].laneInfos[3], 
        roadInfos[6].laneInfos[3],
    ),
    new ConnInfo(//9
        roadInfos[3].laneInfos[3], 
        roadInfos[4].laneInfos[3],
    ),

    new ConnInfo(//10
        roadInfos[5].laneInfos[0], 
        roadInfos[2].laneInfos[0],
    ),
    new ConnInfo(//11
        roadInfos[5].laneInfos[1], 
        roadInfos[0].laneInfos[1],
    ),
    new ConnInfo(//12
        roadInfos[5].laneInfos[2], 
        roadInfos[0].laneInfos[2],
    ),
    new ConnInfo(//13
        roadInfos[5].laneInfos[3], 
        roadInfos[0].laneInfos[3],
    ),
    new ConnInfo(//14
        roadInfos[5].laneInfos[3], 
        roadInfos[6].laneInfos[3],
    ),

    new ConnInfo(//15
        roadInfos[7].laneInfos[0], 
        roadInfos[4].laneInfos[0],
    ),
    new ConnInfo(//16
        roadInfos[7].laneInfos[1], 
        roadInfos[2].laneInfos[1],
    ),
    new ConnInfo(//17
        roadInfos[7].laneInfos[2], 
        roadInfos[2].laneInfos[2],
    ),
    new ConnInfo(//18
        roadInfos[7].laneInfos[3], 
        roadInfos[2].laneInfos[3],
    ),
    new ConnInfo(//19
        roadInfos[7].laneInfos[3], 
        roadInfos[0].laneInfos[3],
    ),
];

export var controlInfos = [
    new ControlInfo(
        connInfos[1],
        0,
        1200,
        0,
        960,
    ),
    new ControlInfo(
        connInfos[2],
        0,
        1200,
        0,
        960,
    ),
    new ControlInfo(
        connInfos[3],
        0,
        1200,
        0,
        960,
    ),
    new ControlInfo(
        connInfos[11],
        0,
        1200,
        0,
        960,
    ),
    new ControlInfo(
        connInfos[12],
        0,
        1200,
        0,
        960,
    ),
    new ControlInfo(
        connInfos[13],
        0,
        1200,
        0,
        960,
    ),

    new ControlInfo(
        connInfos[5],
        0,
        1200,
        300,
        960,
    ),
    new ControlInfo(
        connInfos[6],
        0,
        1200,
        300,
        960,
    ),
    new ControlInfo(
        connInfos[7],
        0,
        1200,
        300,
        960,
    ),
    new ControlInfo(
        connInfos[8],
        0,
        1200,
        300,
        960,
    ),

    new ControlInfo(
        connInfos[15],
        0,
        1200,
        600,
        960,
    ),
    new ControlInfo(
        connInfos[16],
        0,
        1200,
        600,
        960,
    ),
    new ControlInfo(
        connInfos[17],
        0,
        1200,
        600,
        960,
    ),
    new ControlInfo(
        connInfos[18],
        0,
        1200,
        600,
        960,
    ),

    new ControlInfo(
        connInfos[0],
        0,
        1200,
        900,
        960,
    ),
    new ControlInfo(
        connInfos[10],
        0,
        1200,
        900,
        960,
    ),
];

export var carGenInfos = [
    new CarGenInfo(
        roadInfos[1].laneInfos[0],
        0.005,
    ),
    new CarGenInfo(
        roadInfos[1].laneInfos[1],
        0.007,
    ),
    new CarGenInfo(
        roadInfos[1].laneInfos[3],
        0.007,
    ),

    new CarGenInfo(
        roadInfos[3].laneInfos[0],
        0.005,
    ),
    new CarGenInfo(
        roadInfos[3].laneInfos[1],
        0.007,
    ),
    new CarGenInfo(
        roadInfos[3].laneInfos[3],
        0.007,
    ),

    new CarGenInfo(
        roadInfos[5].laneInfos[0],
        0.005,
    ),
    new CarGenInfo(
        roadInfos[5].laneInfos[1],
        0.007,
    ),
    new CarGenInfo(
        roadInfos[5].laneInfos[3],
        0.007,
    ),

    new CarGenInfo(
        roadInfos[7].laneInfos[0],
        0.005,
    ),
    new CarGenInfo(
        roadInfos[7].laneInfos[1],
        0.007,
    ),
    new CarGenInfo(
        roadInfos[7].laneInfos[3],
        0.007,
    ),
];

export var carInfos = [];