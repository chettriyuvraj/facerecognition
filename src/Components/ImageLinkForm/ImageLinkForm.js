import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange,onButtonSubmit}) => {
    return (

        <div>

            <p className ='f3 center'>{'Feed in an image link and the API will detect faces! Give it a try:'}</p>

            
            <div className ='center' >
            <div className='form center pa4 br3 shadow-5'>
            <input className=' br3 f4 pa2 w-70 bw0 center' type='text' onChange={onInputChange}/>
                <button className=' bg-dark-blue moon-gray grow bw0 w-30 f4 ph3 pv2 br3 dib center' onClick={onButtonSubmit}>Submit</button>
                </div>
             </div>
    

        </div>



    );



}

export default ImageLinkForm;