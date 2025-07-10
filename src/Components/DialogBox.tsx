import "./DialogBox.css";

const DialogBox = ({handleSave }:{handleSave:Function}) => {
  if (!handleSave){
    return <>
    <div>
      kjbhjbhjb
    </div>
    </>
  } ;

  return (
    <div className="dialog-overlay">
      <div className="dialog-container">
        <h2>User Added Successfully</h2>
        <p>You can now add another user or close this window.</p>
        <div className="dialog-buttons">
          <button className="btn ok" >Okay</button>
          <button className="btn add" >Add More</button>
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
