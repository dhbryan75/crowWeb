import React from "react";

import HexagonGrid from "./HexagonGrid";
import "./style.css";

class HomePage extends React.Component {
    render() {
        const { width, height } = this.props;
        const homeStyle = {
            width: width,
            height: 2 * height,
        }
        const hexagonGridContainerStyle = {
            position: "absolute",
            left: -80,
            top: -80,
        }

        return (
            <div className="home" style={homeStyle}>
                <div className="hexagonGridContainer" style={hexagonGridContainerStyle}>
                    <HexagonGrid/>
                </div>
            </div>
        );
    }
}

export default HomePage;