import Button from "../button/Button"
import "./Modal.scss"

const Modal = ({ filename, onSave, onCancel }) => {
    return (
        <div className='modal'>
            <div className="head">
                Do you want to save this file?
            </div>
            <div className='body'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-file-earmark" viewBox="0 0 16 16">
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5z" />
                </svg>
                {filename}
            </div>
            <div className='actions'>
                <Button onClick={onCancel} variant='secondary'>Cancel</Button>
                <Button onClick={onSave} variant='primary'>Save</Button>
            </div>
            
        </div>
    )
}

export default Modal