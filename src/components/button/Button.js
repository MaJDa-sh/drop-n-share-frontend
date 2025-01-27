import "./Button.scss"

const Button = ({variant, onClick, children}) => {
    return(
        <button className={`button ${variant}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button