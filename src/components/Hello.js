import { Link } from "react-router-dom";
import {useState} from "react";

export default function Hello() {
    let containerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
    };

    let titleStyle = {
        fontSize: "2rem",
        marginBottom: "2rem",
    };

    const [buttonStyle, setButtonStyle] = useState({
        display: "inline-block",
        padding: "0.5rem 1rem",
        backgroundColor: "#0077ff",
        color: "#fff",
        fontSize: "1rem",
        borderRadius: "0.25rem",
        textDecoration: "none",
        textAlign: "center",
        transition: "background-color 0.2s ease-in-out",
    });

    const buttonHoverStyle = {  //Hover -- 悬停
        backgroundColor: "#cc00bb",
    };

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>欢迎进入Web3.0</h2>
            <Link
                to="/account"
                style={buttonStyle}
                onMouseEnter={() => {
                    setButtonStyle({...buttonStyle,...buttonHoverStyle})
                }}
                onMouseLeave={() => {
                    setButtonStyle({...buttonStyle,backgroundColor:"#0066cc"})
                }}
            >
                去登陆
            </Link>
        </div>
    );
}
