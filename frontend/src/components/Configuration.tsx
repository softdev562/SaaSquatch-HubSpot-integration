import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Configuration() {
  return <View/>
}

export function View(){
  const notify = () => toast.success("BAR", {
    position: toast.POSITION.BOTTOM_RIGHT
  });

  return (
    <div>
        <button 
          onClick={notify}
          type= "button"
          className={"login-button"}
        >
          {"FOO"}
        </button>
      <ToastContainer/>
    </div>
   );
 }
