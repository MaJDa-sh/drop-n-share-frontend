import { useEffect, useState } from "react"
import "./SignUp.css"
import Header from "../../components/header/Header"
import Button from "../../components/button/Button"

const Sign = () => {
    const [signup, setSignup] = useState(false)
    const [signData, setSignData] = useState({
        username: "",
        password: "",
        confirm_password: ""
    })
    const [errorMessage, setErrorMessage] = useState("")

    const HandleSignUp = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signData),
        };
        if (signData.password === signData.confirm_password) {
            fetch(`${process.env.BACKEND_URL}/sign_up`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    if (data.error) {
                        setErrorMessage(data.error);
                    } else {
                        localStorage.setItem("token", data.Token);
                    }
                })
                .then(() => window.location.href = "/profile")
                .catch((error) => {
                    setErrorMessage("An unexpected error occurred.");
                });
        } else {
            setErrorMessage("Passwords do not match")
        }
    }

    const HandleSignIn = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signData),
        };

        fetch(`${process.env.BACKEND_URL}/sign_in`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setErrorMessage(data.error);
                } else {
                    localStorage.setItem("token", data.Token);
                }
            })
            .then(() => window.location.href = "/profile")
            .catch((error) => {
                console.error("Error:", error);
                setErrorMessage("An unexpected error occurred.");
            });
    }

    return (
        <>
            <Header signPage={false} />
            <div className="wrapper">
                <div className="card-switch">
                    <label className="switch">
                        <input type="checkbox" value={signup} onChange={() => { setSignup(!signup); setErrorMessage("") }} className="toggle" />
                        <span className="slider"></span>
                        <span className="card-side"></span>
                        <div className="flip-card__inner">
                            <div className="flip-card__front">
                                <div className="title">Log in</div>
                                <form onSubmit={(e) => HandleSignIn(e)} className="flip-card__form" action="">
                                    <input className="flip-card__input" name="username" value={signData.username} onChange={(e) => setSignData({ ...signData, username: e.target.value })} placeholder="Username" type="text" />
                                    <input className="flip-card__input" name="password" value={signData.password} onChange={(e) => setSignData({ ...signData, password: e.target.value })} placeholder="Password" type="password" />
                                    <Button variant='secondary'>Log in</Button>
                                    <span className='error-message'>{errorMessage}</span>
                                </form>
                            </div>
                            <div className="flip-card__back">
                                <div className="title">Sign up</div>
                                <form onSubmit={(e) => HandleSignUp(e)} className="flip-card__form" action="">
                                    <input className="flip-card__input" name="username" value={signData.username} onChange={(e) => setSignData({ ...signData, username: e.target.value })} placeholder="Username" type="text" />
                                    <input className="flip-card__input" name="password" value={signData.password} onChange={(e) => setSignData({ ...signData, password: e.target.value })} placeholder="Password" type="password" />
                                    <input className="flip-card__input" name="password" value={signData.confirm_password} onChange={(e) => setSignData({ ...signData, confirm_password: e.target.value })} placeholder="Confirm password" type="password" />
                                    <Button type="submit" variant='secondary'>Start sharing!</Button>
                                    <span className='error-message'>{errorMessage}</span>
                                </form>
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        </>
    )
}

export default Sign