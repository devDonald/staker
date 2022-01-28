const Notification = (props) => {
    return (
        <div className="alert alert-warning fixed-top col-md-4">
            {props.msg}
        </div>

    );
};

export default Notification;
