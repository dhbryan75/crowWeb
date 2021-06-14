import React from "react";

import Bird from "../../Components/Bird";
import "./Header.css";

class Header extends React.Component {	
    render() {
        const flamingoColors = {
            body: "#f6f",
            eye: "#000",
            pupil: "#fff",
            beak: "#ff0",
            wing1: "#f9f",
            wing2: "#f9f",
            hair: "#f6f",
            leg: "#fff",
            feet: "#ff0",
        };
        const crowColors = {
            body: "#222",
            eye: "#fff",
            pupil: "#000",
            beak: "#ff0",
            wing1: "#444",
            wing2: "#444",
            hair: "#222",
            leg: "#222",
            feet: "#000",
        };
        const chickenColors = {
            body: "#eee",
            eye: "#000",
            pupil: "#fff",
            beak: "#dd0",
            wing1: "#ccc",
            wing2: "#ccc",
            hair: "#d00",
            leg: "#fff",
            feet: "#dd0",
        };
        const parrotColors = {
            body: "#f66",
            eye: "#fff",
            pupil: "#000",
            beak: "#444",
            wing1: "#0ff",
            wing2: "#ff0",
            hair: "#f66",
            leg: "#222",
            feet: "#ff0",
        };

        return (
            <div className="header">
                <div className="birdContainer">
                    <Bird isRight={true} size={70} colors={flamingoColors}/>
                </div>
                <div className="birdContainer">
                    <Bird isRight={false} size={70} colors={crowColors}/>
                </div>
                <div className="birdContainer">
                    <Bird isRight={true} size={70} colors={chickenColors}/>
                </div>
                <div className="birdContainer">
                    <Bird isRight={false} size={70} colors={parrotColors}/>
                </div>
            </div>
        );
    }
}

export default Header;