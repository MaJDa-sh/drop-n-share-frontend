
import "./Header.scss"
import Button from "../button/Button"
import { Link } from "wouter"

const Header = ({ readyStateRoom, readyStateUsers, state = false, username, sign = true, signOut }) => {
    const token = localStorage.getItem("token")

    return (
        <div className='header'>
            <div className='title-container'>
                {(sign || signOut) &&
                    <Link className='sign' href={token ? 'profile' : 'sign'}>
                        {signOut ?
                            <Button onClick={() => {
                                localStorage.removeItem("token")
                                window.location.href = "/"
                            }} variant='secondary'>Sign out</Button>
                            :
                            token ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                </svg>
                                :
                                <Button variant='secondary'>Sign in</Button>
                        }
                    </Link>
                }

                <a href="/" className="title">Drop 'n Share</a>
                {(readyStateRoom === -1 && readyStateUsers === -1 && state) &&
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="red" className="bi bi-x-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
                    </svg>
                }
                {((readyStateRoom !== 1 || readyStateUsers !== 1) && state) &&
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="yellow" className="bi bi-dash-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z" />
                    </svg>
                }
                {(readyStateRoom === 1 && readyStateUsers === 1 && state) &&
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="green" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                    </svg>
                }
            </div>
            {username &&
                <>
                    <h2>You are:</h2>
                    <h1>{username}</h1>
                </>
            }

        </div>
    )
}

export default Header